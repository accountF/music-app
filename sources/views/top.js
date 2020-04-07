import {JetView} from "webix-jet";

export default class TopView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					padding: 3,
					elements: [
						{
							view: "icon", icon: "mdi mdi-menu", click: () => this.toggleSidebar()
						},
						{view: "label", label: "Music App"}
					]
				},
				{
					cols: [
						{
							view: "sidebar",
							localId: "menu",
							data: [
								{id: "datasetA", icon: "mdi mdi-table-edit", value: "Dataset A"},
								{id: "datasetB", icon: "mdi mdi-table-edit", value: "Dataset B"},
								{id: "list", icon: "mdi mdi-view-list", value: "List of record"},
								{
									id: "settings",
									icon: "mdi mdi-settings-outline",
									value: "Settings"
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
