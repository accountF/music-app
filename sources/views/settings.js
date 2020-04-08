import {JetView} from "webix-jet";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
									header: _("Name"),
									fillspace: true
								},
								{id: "size", header: _("Size")}
							]
						},
						{
							cols: [
								{},
								{
									view: "uploader",
									width: 200,
									localId: "upload",
									value: _("Upload file"),
									name: "files",
									autosend: true,
									upload: "http://localhost:3000/uploader"
								}
							]
						}
					]
				},
				{
					view: "radio",
					localId: "language",
					name: "gr1",
					label: _("Language"),
					value: this.app.getService("locale").getLang(),
					options: [
						{id: "en", value: _("English")},
						{id: "ru", value: _("Russian")}
					],
					click: () => {
						this.toggleLanguage();
					}
				},
				{view: "button", label: _("Change font size"), click: () => this.changeFontSize()},
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

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}
