import { Injectable } from '@angular/core';

@Injectable()
export class IgxTreeService {
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
}