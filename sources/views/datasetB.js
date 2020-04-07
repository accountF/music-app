import {JetView} from "webix-jet";

export default class datasetB extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "memberTable",
			select: true,
			datafetch: 15,
			editable: true,
			columns: [
				{
					id: "name",
					header: "Group member name",
					width: 300,
					editor: "text",
					sort: "server"
				},
				{
					id: "role",
					header: "Role in the group",
					width: 150,
					editor: "text",
					sort: "server"
				},
				{
					id: "birth",
					header: "Date of birth",
					width: 150,
					format: webix.i18n.longDateFormatStr,
					editor: "text",
					sort: "server"
				},
				{
					id: "country",
					header: "Country of birth",
					width: 150,
					editor: "text",
					sort: "server"
				},
				{
					id: "awards",
					header: "Awards",
					editor: "text",
					sort: "server",
					fillspace: true
				}
			]
		};
	}

	init() {
		this.tableComponent = this.$$("memberTable");
		this.tableComponent.load("http://localhost:3000/api/singers");

		this.tableComponent.attachEvent("onEditorChange", (id, value) => {
			let data = {
				[id.column]: value
			};
			webix.ajax().put(`http://localhost:3000/api/singers/${id.row}`, data);
		});
	}
}
