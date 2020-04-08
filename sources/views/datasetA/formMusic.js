import {JetView} from "webix-jet";

export default class formMusic extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			localId: "windowWithForm",
			position: "center",
			head: {
				template: _("Edit band")
			},
			width: 500,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{view: "text", label: _("Groups name"), name: "name", labelWidth: 150},
					{view: "text", label: _("Music style"), name: "style", labelWidth: 150},
					{view: "text", label: _("Albums"), name: "albumNames", labelWidth: 150, disabled: true},
					{view: "datepicker", label: _("Group creation date"), name: "creationDate", labelWidth: 150},
					{view: "text", label: _("Country of foundation"), name: "country", labelWidth: 150},
					{
						cols: [
							{view: "button", label: _("Save"), click: () => this.updateMusic()},
							{view: "button", label: _("Cancel"), click: () => this.closeWindow()}
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
		webix.ajax().get(`http://localhost:3000/bands/${id}`).then((data) => {
			let itemForFill = data.json()[0];
			this.formComponent.setValues(itemForFill);
		});
	}

	updateMusic() {
		const data = this.formComponent.getValues();
		webix.ajax().put(`http://localhost:3000/bands/${data.id}`, data).then((band) => {
			this.app.callEvent("onBandChange", [band.json()]);
		});
		this.closeWindow();
	}

	closeWindow() {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		this.getRoot().hide();
	}
}
