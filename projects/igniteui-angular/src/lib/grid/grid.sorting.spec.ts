import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortingDirection } from '../data-operations/sorting-expression.interface';
import { IgxGridComponent } from './grid.component';
import { IgxGridModule } from './index';
import { GridTemplateStrings, ColumnDefinitions } from '../test-utils/template-strings.spec';
import { BasicGridComponent } from '../test-utils/grid-base-components.spec';
import { SampleTestData } from '../test-utils/sample-test-data.spec';
import { DefaultSortingStrategy } from '../data-operations/sorting-strategy';

const SORTING_ICON_NONE_CONTENT = 'none';
const SORTING_ICON_ASC_CONTENT = 'arrow_upward';
const SORTING_ICON_DESC_CONTENT = 'arrow_downward';

describe('IgxGrid - Grid Sorting', () => {
    let fixture;
    let grid: IgxGridComponent;
    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [
                GridDeclaredColumnsComponent
            ],
            imports: [IgxGridModule.forRoot()]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridDeclaredColumnsComponent);
        fixture.detectChanges();
        grid = fixture.componentInstance.grid;
    });

    it('Should sort grid ascending by column name', () => {
        const currentColumn = 'Name';
        const lastNameColumn = 'LastName';
        grid.sort({fieldName: currentColumn, dir: SortingDirection.Asc, ignoreCase: false, strategy: DefaultSortingStrategy.instance()});

        fixture.detectChanges();

        let expectedResult = 'ALex';
        expect(grid.getCellByColumn(0, currentColumn).value).toEqual(expectedResult);
        expectedResult = 'Smith';
        expect(grid.getCellByColumn(0, lastNameColumn).value).toEqual(expectedResult);
        expectedResult = 'Rick';
        expect(grid.getCellByColumn(grid.data.length - 1, currentColumn).value).toEqual(expectedResult);
        expectedResult = 'BRown';
        expect(grid.getCellByColumn(grid.data.length - 1, lastNameColumn).value).toEqual(expectedResult);

        // Ignore case on sorting set to true
        grid.sort({fieldName: currentColumn, dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()});
        fixture.detectChanges();

        expectedResult = 'ALex';
        expect(grid.getCellByColumn(0, currentColumn).value).toEqual(expectedResult);
    });

    it('Should sort grid descending by column name', () => {
        const currentColumn = 'Name';
        // Ignore case on sorting set to false
        grid.sort({fieldName: currentColumn, dir: SortingDirection.Desc, ignoreCase: false, strategy: DefaultSortingStrategy.instance()});
        fixture.detectChanges();

        let expectedResult = 'Rick';

        expect(grid.getCellByColumn(0, currentColumn).value).toEqual(expectedResult);
        expectedResult = 'ALex';
        expect(grid.getCellByColumn(grid.data.length - 1, currentColumn).value).toEqual(expectedResult);

        // Ignore case on sorting set to true
        grid.sort({ fieldName: currentColumn, dir: SortingDirection.Desc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()});
        fixture.detectChanges();

        expectedResult = 'Rick';
        expect(grid.getCellByColumn(0, currentColumn).value).toEqual(expectedResult);
        expectedResult = 'ALex';
        expect(grid.getCellByColumn(grid.data.length - 1, currentColumn).value).not.toEqual(expectedResult);

    });

    it('Should not sort grid when trying to sort by invalid column', () => {
        const gridData = fixture.componentInstance.data;
        const invalidColumn = 'Age';
        grid.sort({fieldName: invalidColumn, dir: SortingDirection.Desc, ignoreCase: false, strategy: DefaultSortingStrategy.instance()});

        let expectedResult = 'Jane';
        expect(grid.getCellByColumn(0, 'Name').value).toEqual(expectedResult);
        expectedResult = 'Connor';
        expect(grid.getCellByColumn(grid.data.length - 1, 'Name').value).toEqual(expectedResult);

        grid.rowList.map((item, index) =>
            expect(grid.getCellByColumn(index, 'ID').value).toEqual(gridData[index].ID));
    });

    it('Should sort grid by current column by expression (Ascending)', () => {
        const currentColumn = 'ID';
        grid.sortingExpressions = [{ fieldName: currentColumn, dir: SortingDirection.Asc, ignoreCase: true,
            strategy: DefaultSortingStrategy.instance() }];

        fixture.detectChanges();

        expect(grid.getCellByColumn(0, currentColumn).value).toEqual(1);
    });

    it('Should sort grid by current column by expression (Descending with ignoreCase)', () => {
        const currentColumn = 'Name';

        grid.sortingExpressions = [{fieldName: currentColumn, dir: SortingDirection.Desc, ignoreCase: true,
            strategy: DefaultSortingStrategy.instance() }];

        fixture.detectChanges();

        const expectedResult = 'Alex';
        expect(grid.getCellByColumn(grid.data.length - 1, currentColumn).value).toEqual(expectedResult);
    });

    it('Grid sort by multiple expressions and clear sorting through API', () => {
        const firstColumn = 'ID';
        const secondColumn = 'Name';
        const thirdColumn = 'LastName';

        grid.sortingExpressions = [
            {fieldName: secondColumn, dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()},
            {fieldName: firstColumn, dir: SortingDirection.Desc, ignoreCase: true, strategy: DefaultSortingStrategy.instance() }
        ];

        fixture.detectChanges();

        let expectedResult = 'ALex';
        expect(grid.getCellByColumn(0, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'Rick';
        expect(grid.getCellByColumn(grid.data.length - 1, secondColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(grid.data.length - 1, firstColumn).value).toEqual(6);
        expectedResult = 'Jones';
        expect(grid.getCellByColumn(grid.data.length - 1 , thirdColumn).value).toEqual(expectedResult);

        // Clear sorting on a column
        grid.clearSort(firstColumn);
        fixture.detectChanges();

        expect(grid.sortingExpressions.length).toEqual(1);
        expect(grid.sortingExpressions[0].fieldName).toEqual(secondColumn);

        grid.sortingExpressions = [
            {fieldName: secondColumn, dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()},
            {fieldName: firstColumn, dir: SortingDirection.Desc, ignoreCase: true, strategy: DefaultSortingStrategy.instance() }
        ];
        fixture.detectChanges();

        expect(grid.sortingExpressions.length).toEqual(2);

        // Clear sorting on all columns
        grid.clearSort();
        fixture.detectChanges();

        expect(grid.sortingExpressions.length).toEqual(0);
    });

    it('Grid sort by multiple expressions through API using ignoreCase for the second expression', () => {
        const firstColumn = 'ID';
        const secondColumn = 'Name';
        const thirdColumn = 'LastName';
        const exprs = [
            { fieldName: secondColumn, dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance() },
            { fieldName: thirdColumn, dir: SortingDirection.Desc, ignoreCase: true, strategy: DefaultSortingStrategy.instance() }
        ];

        grid.sortingExpressions = exprs;

        fixture.detectChanges();
        let expectedResult = 'ALex';
        expect(grid.getCellByColumn(0, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'Smith';
        expect(grid.getCellByColumn(0, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(0, firstColumn).value).toEqual(5);
        expectedResult = 'Rick';
        expect(grid.getCellByColumn(grid.data.length - 1, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'BRown';
        expect(grid.getCellByColumn(grid.data.length - 1, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(grid.data.length - 1, firstColumn).value).toEqual(7);

        grid.clearSort();
        fixture.detectChanges();

        expect(grid.sortingExpressions.length).toEqual(0);

        grid.sort(exprs);
        fixture.detectChanges();

        expectedResult = 'ALex';
        expect(grid.getCellByColumn(0, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'Smith';
        expect(grid.getCellByColumn(0, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(0, firstColumn).value).toEqual(5);
        expectedResult = 'Rick';
        expect(grid.getCellByColumn(grid.data.length - 1, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'BRown';
        expect(grid.getCellByColumn(grid.data.length - 1, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(grid.data.length - 1, firstColumn).value).toEqual(7);
    });

    // sort now allows only params of type ISortingExpression hence it is not possible to pass invalid expressions
    it(`Grid sort by mixed valid and invalid expressions should update the
            data only by valid ones (through API)`, () => {
        const firstColumn = 'ID';
        const secondColumn = 'Name';
        const thirdColumn = 'LastName';
        const invalidAndValidExp = [
            {fieldName: secondColumn, dir: SortingDirection.Desc, ignoreCase: false, strategy: DefaultSortingStrategy.instance() },
            {fieldName: firstColumn, dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance() }
        ];

        grid.sort(invalidAndValidExp);

        fixture.detectChanges();

        let expectedResult = 'Rick';
        expect(grid.getCellByColumn(0, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'Jones';
        expect(grid.getCellByColumn(0, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(0, firstColumn).value).toEqual(6);
        expectedResult = 'ALex';
        expect(grid.getCellByColumn(grid.data.length - 1, secondColumn).value).toEqual(expectedResult);
        expectedResult = 'Smith';
        expect(grid.getCellByColumn(grid.data.length - 1, thirdColumn).value).toEqual(expectedResult);
        expect(grid.getCellByColumn(grid.data.length - 1, firstColumn).value).toEqual(5);
    });

    // UI Tests

    it('Grid sort ascending by clicking once on first header cell UI', () => {
        const firstHeaderCell = fixture.debugElement.query(By.css('igx-grid-header'));

        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();

        const firstRowFirstCell = getCurrentCellFromGrid(grid, 0, 0);
        const firstRowSecondCell =  getCurrentCellFromGrid(grid, 0, 1);
        let expectedResult = 'Brad';
        expect(getValueFromCellElement(firstRowSecondCell)).toEqual(expectedResult);
        expectedResult = '1';
        expect(getValueFromCellElement(firstRowFirstCell)).toEqual(expectedResult);

        const lastRowFirstCell = getCurrentCellFromGrid(grid, grid.data.length - 1, 0);
        const lastRowSecondCell = getCurrentCellFromGrid(grid, grid.data.length - 1, 1);
        expectedResult = (fixture.componentInstance.data.length).toString();
        expect(getValueFromCellElement(lastRowFirstCell)).toEqual(expectedResult);
        expectedResult = 'Rick';
        expect(getValueFromCellElement(lastRowSecondCell)).toEqual(expectedResult);
    });

    it('Grid sort descending by clicking twice on header cell UI', () => {
        const firstHeaderCell = fixture.debugElement.query(By.css('igx-grid-header'));

        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();
        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();

        const firstRowFirstCell = getCurrentCellFromGrid(grid, 0, 0);
        const firstRowSecondCell = getCurrentCellFromGrid(grid, 0, 1);
        let expectedResult = '7';
        expect(getValueFromCellElement(firstRowFirstCell)).toEqual(expectedResult);
        expectedResult = 'Rick';
        expect(getValueFromCellElement(firstRowSecondCell)).toEqual(expectedResult);

        const lastRowFirstCell = getCurrentCellFromGrid(grid, grid.data.length - 1, 0);
        const lastRowSecondCell = getCurrentCellFromGrid(grid, grid.data.length - 1, 1);
        expectedResult = '1';
        expect(getValueFromCellElement(lastRowFirstCell)).toEqual(expectedResult);
        expectedResult = 'Brad';
        expect(getValueFromCellElement(lastRowSecondCell)).toEqual(expectedResult);
    });

    it('Grid sort none when we click three time on header cell UI', () => {
        const gridData = fixture.componentInstance.data;
        const firstHeaderCell = fixture.debugElement.query(By.css('igx-grid-header'));

        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();
        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();
        clickCurrentRow(firstHeaderCell);
        fixture.detectChanges();

        const firstRowSecondCell = getCurrentCellFromGrid(grid, 0, 1);
        let expectedResult = 'Jane';
        expect(getValueFromCellElement(firstRowSecondCell)).toEqual(expectedResult);

        const lastRowSecondCell = getCurrentCellFromGrid(grid, grid.data.length - 1, 1);
        expectedResult = 'Connor';
        expect(getValueFromCellElement(lastRowSecondCell)).toEqual(expectedResult);

        grid.rowList.map((item, index) =>
            expect(grid.getCellByColumn(index, 'ID').value).toEqual(gridData[index].ID));
    });

    it('Should have a valid sorting icon when sorting using the API.', () => {
        const sortingIcon = fixture.debugElement.query(By.css('.sort-icon'));
        expect(sortingIcon.nativeElement.textContent.trim()).toEqual(SORTING_ICON_NONE_CONTENT);

        grid.sort({ fieldName: 'ID', dir: SortingDirection.Asc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()});
        fixture.detectChanges();
        expect(sortingIcon.nativeElement.textContent.trim()).toEqual(SORTING_ICON_ASC_CONTENT);

        grid.sort({ fieldName: 'ID', dir: SortingDirection.Desc, ignoreCase: true, strategy: DefaultSortingStrategy.instance()});
        fixture.detectChanges();
        expect(sortingIcon.nativeElement.textContent.trim()).toEqual(SORTING_ICON_DESC_CONTENT);

        grid.clearSort();
        fixture.detectChanges();
        expect(sortingIcon.nativeElement.textContent.trim()).toEqual(SORTING_ICON_NONE_CONTENT);
    });
});

@Component({
    template: GridTemplateStrings.declareGrid(
            '',
            '',
            ColumnDefinitions.idFirstLastNameSortable)
})

export class GridDeclaredColumnsComponent extends BasicGridComponent {

    public data = SampleTestData.personIDNameRegionData();

    @ViewChild(IgxGridComponent) public grid: IgxGridComponent;
    @ViewChild('nameColumn') public nameColumn;
    public width = '800px';
}

function getCurrentCellFromGrid(grid, row, cell) {
    const gridRow = grid.rowList.toArray()[row];
    const gridCell = gridRow.cells.toArray()[cell];
    return gridCell;
}

function clickCurrentRow(row) {
    return row.triggerEventHandler('click', new Event('click'));
}

function getValueFromCellElement(cell) {
    return cell.nativeElement.textContent.trim();
}
