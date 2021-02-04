import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren, Input, Output, EventEmitter, ContentChild, Directive, ElementRef, NgModule, TemplateRef, OnInit, AfterViewInit, HostListener, ContentChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { IgxSelectionAPIService } from '../core/selection';
import { IgxExpansionPanelModule } from '../expansion-panel/public_api';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule } from '../input-group/public_api';
import { IGX_TREE_COMPONENT, IGX_TREE_SELECTION_TYPE, IgxTree, ITreeNodeEditedEvent, ITreeNodeEditingEvent, ITreeNodeToggledEventArgs, ITreeNodeTogglingEventArgs, ITreeNodeSelectionEvent, IgxTreeNode } from './common';
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
export class IgxTreeComponent implements IgxTree, OnInit, AfterViewInit {
    public id = `tree-${init_id++}`;

    constructor(private selectionService: IgxSelectionAPIService, private treeService: IgxTreeService) {}

    @Input()
    public selection: IGX_TREE_SELECTION_TYPE = IGX_TREE_SELECTION_TYPE.BiState;

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

    @ContentChildren(IgxTreeNodeComponent)
    public nodes: QueryList<IgxTreeNodeComponent>

    public selectNode(node: IgxTreeNodeComponent): void {
        this.selectionService.add_item(this.id, node.id);
    }

    public isNodeSelected(node: IgxTreeNodeComponent): boolean {
        return this.selectionService.get(this.id).has(node.id);
    }

    public expandNode(node: IgxTreeNodeComponent): void {
        const nodeId = node.id;
        if (this.treeService.isExpanded(nodeId)) {
            return;
        }
        const args: ITreeNodeTogglingEventArgs = {
            owner: this,
            node,
            cancel: false

        }
        this.nodeExpanding.emit(args);
        if (!args.cancel) {
            this.treeService.expand(nodeId);
            this.nodeExpanded.emit({
                owner: this,
                node
            });
        }
    }

    public collapseNode(node: IgxTreeNodeComponent): void {
        const nodeId = node.id;
        if (!this.treeService.isExpanded(nodeId)) {
            return;
        }
        const args: ITreeNodeTogglingEventArgs = {
            owner: this,
            node,
            cancel: false

        }
        this.nodeCollapsing.emit(args);
        if (!args.cancel) {
            this.treeService.collapse(nodeId);
            this.nodeCollapsed.emit({
                owner: this,
                node
            });
        }
    }



    public toggleNode(node: IgxTreeNodeComponent): void {
        const nodeId = node.id;
        if (this.treeService.isExpanded(nodeId)) {
            this.collapseNode(node);
        } else {
            this.expandNode(node);
        }
    }

    private comparer = (node: IgxTreeNodeComponent, data: any) => {
        return node.data === data;
    }

    public findNode(data: any, comparer?: (node: IgxTreeNodeComponent, data: any) => boolean): IgxTreeNode {
        const compareFunc = comparer || this.comparer;
        return this.nodes.find(e => compareFunc(e, data));
    }

    ngOnInit() {
        this.selectionService.set(this.id, new Set());
    }
    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.selectionService.clear(this.id);
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
