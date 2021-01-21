import { Component, ViewChild } from '@angular/core';
import { IgxTreeComponent } from 'igniteui-angular';
import { HIERARCHICAL_SAMPLE_DATA } from '../shared/sample-data';

@Component({
    selector: 'app-tree-sample',
    templateUrl: 'tree.sample.html',
    styleUrls: ['tree.sample.scss']
})
export class TreeSampleComponent {
    @ViewChild(IgxTreeComponent, { read: IgxTreeComponent })
    public tree: IgxTreeComponent;

    public data = HIERARCHICAL_SAMPLE_DATA;
}
