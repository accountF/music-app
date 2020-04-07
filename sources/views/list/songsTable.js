import {JetView} from "webix-jet";

export default class songsTable extends JetView {
	config() {
		return {
			view: "window",
			localId: "windowWithTable",
			position: "center",
			head: {
				cols: [
					{template: "Edit songs", type: "header", borderless: true},
					{
						view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				view: "datatable",
				localId: "table",
				editable: true,
				columns: [
					{
						id: "name",
						header: "Name",
						editor: "text",
						fillspace: true
					}
				]
			}
		};
	}

	init() {
		this.tableComponent = this.$$("table");
		this.window = this.$$("windowWithTable");

		this.tableComponent.attachEvent("onEditorChange", (id, value) => {
			console.log(id);
			let data = {
				[id.column]: value
			};
			webix.ajax().put(`http://localhost:3000/songs/${id.row}`, data).then((song) => {
				this.app.callEvent("onSongChange", [song.json().albumId]);
			});
		});
	}

	showWindow(id) {
		this.tableComponent.clearAll();
		this.getRoot().show();
		let data = webix.ajax().get(`http://localhost:3000/songs/${id.row}`);
		this.tableComponent.parse(data);
	}

	closeWindow() {
		this.$$("windowWithTable").hide();
	}
}
