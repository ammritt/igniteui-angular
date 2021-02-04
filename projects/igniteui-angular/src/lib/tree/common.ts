import { EventEmitter, InjectionToken, QueryList, TemplateRef } from '@angular/core';
import { IBaseCancelableBrowserEventArgs, IBaseEventArgs } from '../core/utils';

// Component interfaces

export interface IgxTree {
    id: string,
    selection: IGX_TREE_SELECTION_TYPE;
    nodeTemplate: TemplateRef<any>,
    nodeEditTemplate: TemplateRef<any>,
    selectMarker: TemplateRef<any>,
    expandIndicator: TemplateRef<any>,
    nodeExpanding: EventEmitter<ITreeNodeTogglingEventArgs>,
    nodeExpanded: EventEmitter<ITreeNodeToggledEventArgs>,
    nodeCollapsing: EventEmitter<ITreeNodeTogglingEventArgs>,
    nodeCollapsed: EventEmitter<ITreeNodeToggledEventArgs>
    expandNode(node: IgxTreeNode): void,
    collapseNode(node: IgxTreeNode): void,
    toggleNode(node: IgxTreeNode): void,
    selectNode(node: IgxTreeNode): void,
}

// Item interfaces
export interface IgxTreeNode {
    parentNode?: IgxTreeNode | null,
    expanded: boolean | null,
    selected: boolean | null,
    data: any,
    children: QueryList<IgxTreeNode> | null,
    index: string
}

// Events
export interface ITreeNodeSelectionEvent extends IBaseCancelableBrowserEventArgs {
    node: IgxTreeNode;
}

export interface ITreeNodeEditingEvent extends IBaseCancelableBrowserEventArgs {
    node: IgxTreeNode;
    value: string;
}

export interface ITreeNodeEditedEvent extends IBaseEventArgs {
    node: IgxTreeNode;
    value: any;
}

export interface ITreeNodeTogglingEventArgs extends IBaseEventArgs, IBaseCancelableBrowserEventArgs {
    node: IgxTreeNode;
}

export interface ITreeNodeToggledEventArgs extends IBaseEventArgs {
    node: IgxTreeNode;
}

// Enums
export enum IGX_TREE_SELECTION_TYPE {
    Non = "Non",
    BiState = "BiState",
    Cascading = "Cascading"
}

// Token
export const IGX_TREE_COMPONENT = new InjectionToken<IgxTree>('IgxTreeToken');
export const IGX_TREE_NODE_COMPONENT = new InjectionToken<IgxTreeNode>('IgxTreeNodeToken');