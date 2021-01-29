import { Injectable } from '@angular/core';
import { IgxTreeNode } from './common';

@Injectable()
export class IgxTreeService {
    private treeRoot: IgxTreeNode[];

    public expandedNodes: Set<string> = new Set<string>();
    
    expand(id: string): void {
        this.expandedNodes.add(id);
    }

    collapse(id: string): void {
        this.expandedNodes.delete(id);
    }

    isExpanded(id: string): boolean {
        return this.expandedNodes.has(id);
    }

    public findNode(nodePath: string[], array?: IgxTreeNode[]): IgxTreeNode {
        array = array || this.treeRoot;
        const targetNode = array.find(node => node.id = nodePath[0]);
        if (nodePath.length === 1) {
            return targetNode;
        }
        this.findNode(nodePath.slice(-1 * (nodePath.length - 1)), targetNode.children)
    }

    public registerNode(node: IgxTreeNode, parentPath: string[]): void {
        if (parentPath.length = 0) {
            this.treeRoot[node.id] = node;
            return;
        }
        var parentNode = this.findNode(parentPath);
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.push(node);
    }
}