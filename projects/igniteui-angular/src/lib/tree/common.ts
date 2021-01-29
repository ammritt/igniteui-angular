import { EventEmitter, InjectionToken, TemplateRef } from '@angular/core';
import { IBaseCancelableBrowserEventArgs, IBaseCancelableEventArgs, IBaseEventArgs } from '../core/utils';

// Component interfaces

export interface IgxTree {
    id: string,
    nodeTemplate: TemplateRef<any>,
    nodeEditTemplate: TemplateRef<any>,
    selectMarker: TemplateRef<any>,
    expandIndicator: TemplateRef<any>,
    valueKey: string,
    textKey: string,
    childKey: string,
    nodeEdited: EventEmitter<ITreeNodeEditedEvent>,
    nodeEditing: EventEmitter<ITreeNodeEditingEvent>
    nodeExpanding: EventEmitter<ITreeNodeTogglingEventArgs>,
    nodeExpanded: EventEmitter<ITreeNodeToggledEventArgs>,
    expandNode(node: IgxTreeNode): void,
    collapseNode(node: IgxTreeNode): void,
    toggleNode(node: IgxTreeNode): void,
    selectNode(node: IgxTreeNode): void,
    updateNodeText(id: string, value: string): void,
    updateNode(node: IgxTreeNode, value: any): void,
    deleteNode(node: IgxTreeNode): void,
    addNode(data: any, parentNode?: IgxTreeNode): void
}

// Item interfaces
export interface IgxTreeNode {
    id: string,
    fullPath: string[],
    parentId: string | null,
    expanded: boolean | null,
    selected: boolean,
    data: any,
    level: number,
    children: any[] | null,
    valueKey: string,
    textKey: string,
    childKey: string,
    index: string
}

export interface ITreeRoot {
}

export interface ITreeBranch extends IgxTreeNode {
    children: IgxTreeNode[],
    childKey: string
}

// Events
export interface ITreeNodeSelectionEvent extends IBaseCancelableBrowserEventArgs {
    nodeId: string;
}

export interface ITreeNodeEditingEvent extends IBaseCancelableBrowserEventArgs {
    nodeId: string;
    value: string;
}

export interface ITreeNodeEditedEvent extends IBaseEventArgs {
    nodeId: string;
    value: any;
}

export interface ITreeNodeTogglingEventArgs extends IBaseEventArgs, IBaseCancelableBrowserEventArgs {
    nodeId: string;
}

export interface ITreeNodeToggledEventArgs extends IBaseEventArgs {
    nodeId: string;
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