import {JetView} from "webix-jet";

export default class datasetB extends JetView {
	config() {
		return {
			view: "treetable",
			localId: "tree",
			datafetch: 15,
			editable: true,
			columns: [
				{
					id: "bandName",
					header: "Band",
					width: 150,
					template: (obj, common) => {
						if (obj.$level === 1) return common.treetable(obj, common) + obj.bandName;
						return "";
					}
				},
				{id: "name", header: "Name", width: 150, editor: "text", sort: "server"},
				{id: "role", header: "Role", width: 150, editor: "text", sort: "server"},
				{
					id: "birth",
					header: "Birth",
					width: 150,
					editor: "text",
					sort: "server",
					format: webix.i18n.longDateFormatStr
				},
				{id: "country", header: "Country", width: 150, editor: "text", sort: "server"},
				{id: "awards", header: "Awards", width: 150, editor: "text", sort: "server"}
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
