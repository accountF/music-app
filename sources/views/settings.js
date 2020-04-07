import {JetView} from "webix-jet";

export default class Settings extends JetView {
	config() {
		return {
			rows: [
				{
					view: "form",
					localId: "files",
					rows: [
						{
							view: "datatable",
							localId: "filesTable",
							type: "uploader",
							borderless: true,
							columns: [
								{
									id: "name",
									header: "Name",
									fillspace: true
								},
								{id: "size", header: "Size"}
							]
						},
						{
							cols: [
								{},
								{
									view: "uploader",
									width: 200,
									localId: "upload",
									value: "Upload file",
									name: "files",
									autosend: true,
									upload: "http://localhost:3000/uploader"
								}
							]
						}
					]
				},
				{view: "radio", name: "gr1", label: "Language", options: ["English", "Russian"]},
				{view: "button", label: "Change font size", click: () => this.changeFontSize()},
				{}
			]
		};
	}

	init() {
		this.tableComponent = this.$$("filesTable");
		this.getFiles();

		this.$$("upload").attachEvent("onUploadComplete", () => {
			this.tableComponent.clearAll();
			this.getFiles();
		});
	}

	getFiles() {
		webix.ajax().get("http://localhost:3000/uploader/").then((files) => {
			this.tableComponent.parse(files);
		});
	}

	changeFontSize() {
		function addStyle(styleString) {
			const style = document.createElement("style");
			style.textContent = styleString;
			document.head.append(style);
		}
		addStyle(".webix_dtable { font-size: 17px!important;}");
	}
}
