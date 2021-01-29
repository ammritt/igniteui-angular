import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren, Input, Output, EventEmitter, ContentChild, Directive, ElementRef, NgModule, TemplateRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { IgxSelectionAPIService } from '../core/selection';
import { IgxExpansionPanelModule } from '../expansion-panel/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IGX_TREE_COMPONENT, IGX_TREE_SELECTION_TYPE, IgxTree, ITreeNodeEditedEvent, ITreeNodeEditingEvent, ITreeNodeToggledEventArgs, ITreeNodeTogglingEventArgs, ITreeNodeSelectionEvent, ITreeRoot, IgxTreeNode } from './common';
import { IgxTreeNodeComponent } from './tree-node/tree-node.component';
import { IgxTreeService } from './tree.service';

let init_id = 0;

@Directive({
    selector: '[igxTreeNode]'
})
export class IgxTreeNodeDirective {
    constructor(public element: ElementRef) {
    }
}

@Directive({
    selector: '[igxTreeNodeEdit]'
})
export class IgxTreeNodeEditingDirective {
    constructor(public element: ElementRef) {
    }
}

@Directive({
    selector: '[igxTreeSelectMarker]'
})
export class IgxTreeSelectMarkerDirective {
    constructor(public element: ElementRef) {
    }
}

@Directive({
    selector: '[igxTreeExpandIndicator]'
})
export class IgxTreeExpandIndicatorDirective {
    constructor(public element: ElementRef) {
    }
}

@Component({
    selector: 'igx-tree',
    templateUrl: "tree.component.html",
    styleUrls: ["tree.component.scss"],
    providers: [
        IgxTreeService,
        { provide: IGX_TREE_COMPONENT, useExisting: IgxTreeComponent}
    ]
})
export class IgxTreeComponent implements ITreeRoot, IgxTree, OnInit, AfterViewInit {
    public id = `tree-${init_id++}`;

    constructor(private selectionService: IgxSelectionAPIService, private treeService: IgxTreeService) {}

    @Input()
    public dataSource: any[];

    @Input()
    public valueKey: string;

    @Input()
    public textKey: string;

    @Input()
    public childKey: string;

    @Input()
    public selectionMode: IGX_TREE_SELECTION_TYPE = IGX_TREE_SELECTION_TYPE.BiState;

    @Output()
    public nodeSelection = new EventEmitter<ITreeNodeSelectionEvent>()

    @Output()
    public nodeEditing = new EventEmitter<ITreeNodeEditingEvent>();

    @Output()
    public nodeEdited = new EventEmitter<ITreeNodeEditedEvent>();

    @Output()
    public nodeExpanding = new EventEmitter<ITreeNodeTogglingEventArgs>();

    @Output()
    public nodeExpanded = new EventEmitter<ITreeNodeToggledEventArgs>();

    @Output()
    public nodeCollapsing = new EventEmitter<ITreeNodeTogglingEventArgs>();

    @Output()
    public nodeCollapsed = new EventEmitter<ITreeNodeToggledEventArgs>();

    @ContentChild(IgxTreeNodeDirective, { read: TemplateRef })
    public nodeTemplate: TemplateRef<any>;

    @ContentChild(IgxTreeNodeEditingDirective, { read: TemplateRef })
    public nodeEditTemplate: TemplateRef<any>;

    @ContentChild(IgxTreeSelectMarkerDirective, { read: TemplateRef })
    public selectMarker: TemplateRef<any>;

    @ContentChild(IgxTreeExpandIndicatorDirective, { read: TemplateRef })
    public expandIndicator: TemplateRef<any>;

    @ViewChildren(IgxTreeNodeComponent)
    public nodes: QueryList<IgxTreeNodeComponent>

    public addNode(data: any, parentNode?: IgxTreeNode): void {
        if (parentNode === null || parentNode === undefined) {
            this.dataSource.push(data);
            return;
        }
        var targetNode = this.findDataEntry(parentNode.fullPath, this.dataSource);
        if (targetNode === null) {
            throw new Error("Parent not with specified path not found.")
        }
        if (!targetNode[this.childKey]) {
            targetNode[this.childKey] = [];
        }
        targetNode[this.childKey].push(data);
    }

    public deleteNode(node: IgxTreeNode): void {
        const nodePath = node.fullPath;
        if (nodePath === null || nodePath === undefined)  {
            return;
        }
        var targetNode = this.findDataEntry(nodePath, this.dataSource);
        var parentNode = nodePath.length === 1 ? this.dataSource : this.findDataEntry(nodePath.slice(0, nodePath.length - 1), this.dataSource)[this.childKey];
        var targetIndex = parentNode.findIndex(e => e[this.valueKey] === targetNode[this.valueKey]);
        (parentNode as any[]).splice(targetIndex, 1);
    }

    public updateNode(nodePath: any, data: any): void {}

    public updateNodeText(nodePath: any, text: any): void {}

    public selectNode(node: IgxTreeNode): void {
        this.selectionService.add_item(this.id, node.id);
    }

    public isNodeSelected(nodeId: string): boolean {
        return this.selectionService.get(this.id).has(nodeId);
    }

    public expandNode(node: IgxTreeNode): void {
        const nodeId = node.id;
        if (this.treeService.isExpanded(nodeId)) {
            return;
        }
        const args: ITreeNodeTogglingEventArgs = {
            owner: this,
            nodeId,
            cancel: false

        }
        this.nodeExpanding.emit(args);
        if (!args.cancel) {
            this.treeService.expand(nodeId);
            this.nodeExpanded.emit({
                owner: this,
                nodeId
            });
        }
    }

    public collapseNode(node: IgxTreeNode): void {
        const nodeId = node.id;
        if (!this.treeService.isExpanded(nodeId)) {
            return;
        }
        const args: ITreeNodeTogglingEventArgs = {
            owner: this,
            nodeId,
            cancel: false

        }
        this.nodeCollapsing.emit(args);
        if (!args.cancel) {
            this.treeService.collapse(nodeId);
            this.nodeCollapsed.emit({
                owner: this,
                nodeId
            });
        }
    }

    public toggleNode(node: IgxTreeNode): void {
        const nodeId = node.id;
        if (this.treeService.isExpanded(nodeId)) {
            this.collapseNode(node);
        } else {
            this.expandNode(node);
        }
    }

    private findDataEntry(nodePath: string[], data: { [key: string] : any }): any {
        if (nodePath.length === 1) {
            return data.find(e => e[this.valueKey] === nodePath[0]);
        } else {
            var parentData = data.find(e => e[this.valueKey] === nodePath[0]);
            return this.findDataEntry(nodePath.slice(-1 * (nodePath.length - 1)), parentData[this.childKey])
        }
    }

    public findNode(nodePath: string[]): IgxTreeNode {
        return this.treeService.findNode(nodePath);
    }

    ngOnInit() {
        this.selectionService.set(this.id, new Set());
    }
    ngAfterViewInit() {

    }
}

@NgModule({
    declarations: [
        IgxTreeNodeDirective,
        IgxTreeNodeEditingDirective,
        IgxTreeSelectMarkerDirective,
        IgxTreeExpandIndicatorDirective,
        IgxTreeComponent,
        IgxTreeNodeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxExpansionPanelModule
    ],
    exports: [
        IgxTreeNodeDirective,
        IgxTreeNodeEditingDirective,
        IgxTreeSelectMarkerDirective,
        IgxTreeExpandIndicatorDirective,
        IgxTreeComponent,
        IgxTreeNodeComponent,
        IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxExpansionPanelModule
    ]
})
export class IgxTreeModule {
}
