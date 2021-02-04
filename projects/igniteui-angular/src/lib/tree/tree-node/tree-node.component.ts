import {
    Component, OnInit,
    OnDestroy, ChangeDetectionStrategy, Input, Inject, ViewChild, TemplateRef, AfterViewInit, forwardRef, HostListener, ViewChildren, Optional, QueryList, ContentChildren
} from '@angular/core';
import { IgxSelectionAPIService } from '../../core/selection';
import { IgxExpansionPanelComponent } from '../../expansion-panel/public_api';
import { IGX_TREE_COMPONENT, IgxTree, IgxTreeNode, IGX_TREE_NODE_COMPONENT } from '../common';
import { IgxTreeComponent } from '../tree.component';
import { IgxTreeService } from '../tree.service';


let nodeId = 0;

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
        protected selectionService: IgxSelectionAPIService,
        protected treeService: IgxTreeService
    ) { }

    @Input()
    public parentId: string | null;

    @Input()
    public parentPath: string;

    public id = `igxTreeNode_${nodeId++}`;

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

    @ContentChildren(IGX_TREE_NODE_COMPONENT)
    protected _children: QueryList<IgxTreeNode>;

    public get children(): QueryList<IgxTreeNode> {
        return this._children;
    }

    @ViewChild(IgxExpansionPanelComponent, { read: IgxExpansionPanelComponent })
    public expansionPanel: IgxExpansionPanelComponent;

    @ViewChild('defaultTemplate', { read: TemplateRef, static: true })
    private _defaultNodeTemplate: TemplateRef<any>;

    public get nodeTemplateRef(): TemplateRef<any> {
        return this.nodeTemplate ? this.nodeTemplate : this._defaultNodeTemplate
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

    public get selected(): boolean {
        return this.selectionService.get(this.tree.id).has(this.id);
    }

    public get expanded(): boolean {
        return this.treeService.isExpanded(this.id);
    }

    public get templateContext(): any {
        return {
            $implicit: this
        }
    }

    public get fullPath(): string[] {
        return [];
    }

    /** @hidden @internal */
    public cancelInteraction(event: any) {
        event.cancel = true;
    }

    public toggle(evt: any) {
        this.tree.toggleNode(this);
    }

    public select(evt: any) {
        this.tree.selectNode(this);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {

    }
}
