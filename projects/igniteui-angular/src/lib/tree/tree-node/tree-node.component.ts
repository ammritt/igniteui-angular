import {
    Component, OnInit,
    OnDestroy, ChangeDetectionStrategy, Input, Inject, ViewChild, TemplateRef, AfterViewInit, forwardRef, HostListener
} from '@angular/core';
import { IgxSelectionAPIService } from '../../core/selection';
import { IExpansionPanelCancelableEventArgs } from '../../expansion-panel/expansion-panel.common';
import { IExpansionPanelEventArgs, IgxExpansionPanelComponent } from '../../expansion-panel/public_api';
import { IGX_TREE_COMPONENT, ITreeComponent, ITreeNode } from '../common';
import { IgxTreeExpandIndicatorDirective, IgxTreeNodeDirective, IgxTreeNodeEditingDirective, IgxTreeSelectMarkerDirective } from '../tree.component';
import { IgxTreeService } from '../tree.service';
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
    styleUrls: ["tree-node.component.scss"]
})
export class IgxTreeNodeComponent implements ITreeNode, OnInit, AfterViewInit, OnDestroy {
    
    public inEdit: boolean = false;
    constructor(@Inject(IGX_TREE_COMPONENT) public tree: ITreeComponent, private selectionService: IgxSelectionAPIService, private treeService: IgxTreeService) { }

    @Input()
    public parentPath: string;

    @Input()
    public id: string;

    @Input()
    public depth: number;

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
        return this.nodeEditTemplate ? this.nodeEditTemplate :  this._defaultNodeEdit
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

    public toggle(event?: IExpansionPanelCancelableEventArgs): void {
        if (event.event) {
            if (event.event.type === "keydown" && (event.event as KeyboardEvent).code === "Enter") {
                this.exitEditMode()
            }
            const targetContainer = (event.event.target as HTMLElement).parentElement;
            const panelIconContainer = this.expansionPanel.header.iconRef.nativeElement;
            if (targetContainer !== panelIconContainer) {
                event.cancel = true;
                return;
            }
        }
        this.tree.toggleNode(this.id);
    }

    public get expanded(): boolean {
        return this.treeService.isExpanded(this.id);
    }

    public get templateContext(): any {
        return {
            $implicit: {
                data: this.data,
                id: this.id,
                expanded: this.expanded,
                selected: this.selected,
                parentPath: this.parentPath,
                fullPath: this.fullPath
            }
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

    ngOnInit() {
        console.log(this.tree);
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }
}
