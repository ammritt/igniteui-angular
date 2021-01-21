import { EventEmitter, InjectionToken, TemplateRef } from '@angular/core';
import { IBaseCancelableBrowserEventArgs, IBaseCancelableEventArgs, IBaseEventArgs } from '../core/utils';

// Component interfaces

export interface ITreeComponent {
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
    expandNode(id: string): void,
    collapseNode(id: string): void,
    toggleNode(id: string): void,
    selectNode(id: string): void,
    updateNodeText(id: string, value: string): void,
    updateNode(id: string, value: any): void,
    deleteNode(nodePath: string[]): void,
    addNode(data: any, parentPath?: string[]): void
}

// Item interfaces
export interface ITreeNode {
    id: string,
    depth: number,
    fullPath: string[],
    children?: ITreeNode[]
}

export interface ITreeRoot {
}

export interface ITreeBranch extends ITreeNode {
    children: ITreeNode[],
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
export const IGX_TREE_COMPONENT = new InjectionToken<ITreeComponent>('IgxComboComponentToken');