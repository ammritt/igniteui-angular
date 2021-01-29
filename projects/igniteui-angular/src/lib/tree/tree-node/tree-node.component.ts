import {
    Component, OnInit,
    OnDestroy, ChangeDetectionStrategy, Input, Inject, ViewChild, TemplateRef, AfterViewInit, forwardRef, HostListener, ViewChildren, Optional, QueryList
} from '@angular/core';
import { IgxSelectionAPIService } from '../../core/selection';
import { IgxExpansionPanelComponent } from '../../expansion-panel/public_api';
import { IGX_TREE_COMPONENT, IgxTree, IgxTreeNode, IGX_TREE_NODE_COMPONENT } from '../common';
import { IgxTreeExpandIndicatorDirective, IgxTreeNodeDirective, IgxTreeNodeEditingDirective, IgxTreeSelectMarkerDirective } from '../tree.component';
import { IgxTreeService } from '../tree.service';

interface IgxTreeNodeInstance extends IgxTreeNode {
    representation: IgxTreeNode
}

/**
 *
 * The tree node component represents a child node of the tree component or another tree node.
 * Usage:
 *
 * ```html
 *  <tree [data]="data" [titleDataKey]="'Title'"></tree>
 * ```
 */
@Component({
    selector: "igx-tree-node",
    templateUrl: "tree-node.component.html",
    styleUrls: ["tree-node.component.scss"],
    providers: [
        { provide: IGX_TREE_NODE_COMPONENT, useExisting: IgxTreeNodeComponent }
    ]
})
export class IgxTreeNodeComponent implements IgxTreeNode, OnInit, AfterViewInit, OnDestroy {

    public inEdit: boolean = false;
    constructor(
        @Inject(IGX_TREE_COMPONENT) public tree: IgxTree,
        private selectionService: IgxSelectionAPIService,
        private treeService: IgxTreeService
    ) { }

    @Input()
    public parentId: string | null;

    @Input()
    public parentPath: string;

    @Input()
    public id: string;

    @Input()
    public level: number;

    @Input()
    public index: string;

    @Input()
    public data: any;

    @Input()
    public nodeTemplate: TemplateRef<any>;

    @Input()
    public nodeEditTemplate: TemplateRef<any>;

    @Input()
    public selectMarker: TemplateRef<any>;

    @Input()
    public expandIndicator: TemplateRef<any>;

    @ViewChildren(IGX_TREE_NODE_COMPONENT)
    private _children: QueryList<IgxTreeNodeInstance>;

    @ViewChild(IgxExpansionPanelComponent, { read: IgxExpansionPanelComponent })
    public expansionPanel: IgxExpansionPanelComponent;

    @ViewChild('defaultTemplate', { read: TemplateRef, static: true })
    private _defaultNodeTemplate: TemplateRef<any>;

    public get nodeTemplateRef(): TemplateRef<any> {
        return this.nodeTemplate ? this.nodeTemplate : this._defaultNodeTemplate
    }

    @ViewChild('defaultEdit', { read: TemplateRef, static: true })
    private _defaultNodeEdit: TemplateRef<any>;

    public get nodeEditTemplateRef(): TemplateRef<any> {
        return this.nodeEditTemplate ? this.nodeEditTemplate : this._defaultNodeEdit
    }
    @ViewChild('defaultSelect', { read: TemplateRef, static: true })
    private _defaultSelectMarker: TemplateRef<any>;

    public get selectMarkerTemplate(): TemplateRef<any> {
        return this.selectMarker ? this.selectMarker : this._defaultSelectMarker
    }

    @ViewChild('defaultIndicator', { read: TemplateRef, static: true })
    private _defaultExpandIndicatorTemplate: TemplateRef<any>;

    public get expandIndicatorTemplate(): TemplateRef<any> {
        return this.expandIndicator ? this.expandIndicator : this._defaultExpandIndicatorTemplate
    }

    public get headerTemplate(): TemplateRef<any> {
        return this.inEdit ? this.nodeEditTemplateRef : this.nodeTemplate
    }

    public get selected(): boolean {
        return this.selectionService.get(this.tree.id).has(this.id);
    }

    public get children(): IgxTreeNode[] {
        
        return this.data[this.childKey] !== undefined ? this._children?.map(e => e.representation) : null;
    }

    public get representation(): IgxTreeNode {
        return {
            id: this.id,
            fullPath: this.fullPath,
            parentId: this.parentId,
            expanded: this.expanded,
            selected: this.selected,
            data: this.data,
            level: this.level,
            children: this.children,
            valueKey: this.valueKey,
            textKey: this.textKey,
            childKey: this.childKey,
            index: this.index
        }
    }

    @HostListener('keypress.enter')
    public exitEditMode() {
        if (this.inEdit) {
            this.inEdit = false;
        }
    }

    public setEditMode() {
        console.log("Double click");
        this.inEdit = true;
    }


    public get expanded(): boolean {
        return this.treeService.isExpanded(this.id);
    }

    public get templateContext(): any {
        return {
            $implicit: this.representation
        }
    }

    public get valueKey(): string {
        return this.tree.valueKey;
    }

    public get textKey(): string {
        return this.tree.textKey
    }

    public get childKey(): string {
        return this.tree.childKey
    }

    public get fullPath(): string[] {
        return [...this.parentPath, this.data[this.valueKey]];
    }

    public toggle() {
        this.tree.toggleNode(this.representation);
    }

    ngOnInit() {
        console.log(this.tree);
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }
}
