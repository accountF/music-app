import {JetView} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "toolbar",
					padding: 3,
					elements: [
						{
							view: "icon", icon: "mdi mdi-menu", click: () => this.toggleSidebar()
						},
						{view: "label", label: _("Music App")}
					]
				},
				{
					cols: [
						{
							view: "sidebar",
							localId: "menu",
							data: [
								{id: "datasetA", icon: "mdi mdi-table-edit", value: _("Dataset A")},
								{id: "datasetB", icon: "mdi mdi-table-edit", value: _("Dataset B")},
								{id: "list", icon: "mdi mdi-view-list", value: _("List of record")},
								{
									id: "settings",
									icon: "mdi mdi-settings-outline",
									value: _("Settings")
								}
							]
						},
						{$subview: true}
					]
				}
			]
		};
	}

	init(view, url) {
		this.menuComponent = this.$$("menu");
		this.menuComponent.select(url[1].page);
		this.menuComponent.attachEvent("onAfterSelect", (newValue) => {
			this.show(`./${newValue}`);
		});
	}

	toggleSidebar() {
		this.menuComponent.toggle();
	}
}
