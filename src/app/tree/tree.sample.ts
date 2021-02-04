import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IgxTreeComponent } from 'igniteui-angular';
import { HIERARCHICAL_SAMPLE_DATA } from '../shared/sample-data';

@Component({
    selector: 'app-tree-sample',
    templateUrl: 'tree.sample.html',
    styleUrls: ['tree.sample.scss']
})
export class TreeSampleComponent implements AfterViewInit {
    @ViewChild(IgxTreeComponent, { read: IgxTreeComponent })
    public tree: IgxTreeComponent;

    public data = HIERARCHICAL_SAMPLE_DATA;

    @ViewChild('headerTemplate')
    public ht: any

    handleExpanded(event: any) {
        console.log(event.node?.children);
    }

    ngAfterViewInit() {
        console.log(this.ht);
    }
}
