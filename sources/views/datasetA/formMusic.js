import {JetView} from "webix-jet";
import {bandsData} from "../../models/bandsData";

export default class formMusic extends JetView {
	config() {
		return {
			view: "window",
			localId: "windowWithForm",
			position: "center",
			head: {
				template: "Edit band"
			},
			width: 500,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{view: "text", label: "Groups name", name: "name", labelWidth: 150},
					{view: "text", label: "Music style", name: "style", labelWidth: 150},
					{view: "text", label: "Albums", name: "albumNames", labelWidth: 150, disabled: true},
					{view: "datepicker", label: "Group creation date", name: "creationDate", labelWidth: 150},
					{view: "text", label: "Country of foundation", name: "country", labelWidth: 150},
					{
						cols: [
							{view: "button", label: "Save", click: () => this.updateMusic()},
							{view: "button", label: "Cancel", click: () => this.closeWindow()}
						]
					}
				]
			}
		};
	}

	init() {
		this.formComponent = this.$$("form");
	}

	showWindow(id) {
		this.getRoot().show();
		const itemForFill = bandsData.getItem(id.row);
		this.formComponent.setValues(itemForFill);
	}

	updateMusic() {
		const itemForUpdate = this.formComponent.getValues();
		bandsData.updateItem(itemForUpdate.id, itemForUpdate);
		this.closeWindow();
	}

	closeWindow() {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		this.getRoot().hide();
	}
}
