import {JetView} from "webix-jet";
import {bandsData} from "../models/bandsData";
import formMusic from "./datasetA/formMusic";

export default class datasetA extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "bandsTable",
					select: true,
					columns: [
						{
							id: "name",
							header: ["Groups name", {content: "textFilter"}],
							width: 150,
							sort: "string"
						},
						{
							id: "style",
							header: ["Music style", {content: "textFilter"}],
							autowidth: true,
							sort: "string"
						},
						{
							id: "albumNames",
							header: ["Albums", {content: "textFilter"}],
							fillspace: true,
							sort: "string"
						},
						{
							id: "creationDate",
							header: ["Group creation date",
								{
									content: "datepickerFilter",
									compare(cellValue, filterValue) {
										const dateToStr = webix.i18n.dateFormatStr(cellValue);
										const filterToStr = webix.i18n.dateFormatStr(filterValue);
										if (dateToStr === filterToStr) {
											return true;
										}
										return false;
									}
								}
							],
							width: 150,
							format: webix.i18n.longDateFormatStr,
							sort: "date"
						},
						{
							id: "country",
							header: ["Country", {content: "textFilter"}],
							autowidth: true,
							sort: "string"
						}
					],
					on: {
						onItemClick: id => this.window.showWindow(id)
					}
				},
				{
					cols: [
						{
							view: "button",
							label: "Export to excel",
							click: () => this.exportToExcel()
						},
						{view: "button", label: "Refresh", click: () => this.refreshTable()}
					]
				}
			]
		};
	}

	init() {
		this.musicTable = this.$$("bandsTable");
		this.musicTable.sync(bandsData);
		this.window = this.ui(formMusic);
	}

	exportToExcel() {
		webix.toExcel(this.musicTable, {
			rawValues: true,
			columns: [
				{id: "name", header: "Groups name"},
				{
					id: "style",
					header: "Music style"
				},
				{
					id: "albumNames",
					header: "Albums"
				},
				{
					id: "creationDate",
					header: "Group creation date",
					exportType: "date",
					exportFormat: "d-mmm-yy"
				},
				{
					id: "country",
					header: "Country of foundation"
				}
			]
		});
	}

	refreshTable() {
		bandsData.load("http://localhost:3000/bands").then(() => {
			this.musicTable.clearAll();
			this.musicTable.sync(bandsData);
		});
	}
}
