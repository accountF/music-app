import {JetView} from "webix-jet";

export default class datasetB extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "treetable",
			localId: "tree",
			datafetch: 15,
			editable: true,
			columns: [
				{
					id: "bandName",
					header: _("Band"),
					width: 150,
					template: (obj, common) => {
						if (obj.$level === 1) return common.treetable(obj, common) + obj.bandName;
						return "";
					}
				},
				{id: "name", header: _("Name"), width: 150, editor: "text", sort: "server"},
				{id: "role", header: _("Role"), width: 150, editor: "text", sort: "server"},
				{
					id: "birth",
					header: _("Birth"),
					width: 150,
					editor: "text",
					sort: "server",
					format: webix.i18n.longDateFormatStr
				},
				{id: "country", header: _("Country"), width: 150, editor: "text", sort: "server"},
				{id: "awards", header: _("Awards"), width: 150, editor: "text", sort: "server"}
			]
		};
	}

	init() {
		this.treeComponent = this.$$("tree");
		this.treeComponent.load("http://localhost:3000/singers");
		this.treeComponent.attachEvent("onBeforeEditStart", (cell) => {
			if (typeof cell.row === "number") {
				return false;
			} return true;
		});
		// this.treeComponent.attachEvent("onEditorChange", (id, value) => {
		// 	let data = {
		// 		[id.column]: value
		// 	};
		// 	webix.ajax().put(`http://localhost:3000/singers/${id.row}`, data);
		// });
	}
}
