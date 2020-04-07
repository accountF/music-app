import {JetView} from "webix-jet";
import {bandsData} from "../models/bandsData";
import songsTable from "./list/songsTable";

export default class datasetB extends JetView {
	config() {
		return {
			rows: [
				{
					view: "list",
					select: true,
					localId: "recordList",
					template: bands => `${bands.name}`
				},
				{
					view: "datatable",
					localId: "recordTable",
					select: true,
					editable: true,
					columns: [
						{
							id: "name",
							header: "Album name",
							fillspace: true,
							editor: "text"
						},
						{
							id: "releaseDate",
							header: "Release date",
							format: webix.i18n.longDateFormatStr,
							width: 200,
							editor: "text"
						},
						{
							id: "numberOfSongs",
							header: "Number of songs",
							width: 150
						},
						{
							id: "numberOfCopies",
							header: "Number of issued copies",
							width: 150,
							editor: "text"
						},
						{id: "edit", header: "", template: "{common.editIcon()}", width: 50},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
					],
					onClick: {
						"wxi-trash": (e, id) => this.deleteItem(id),
						"wxi-pencil": (e, id) => this.editSong(id)
					}
				},
				{
					template: albumDetails => `<div>
							<img class="album-photo" src=${albumDetails.photo} />
							Band name: ${albumDetails.bandName} <br>
							Album name: ${albumDetails.albumName} <br>
							Songs: ${albumDetails.songs} <br>
							Awards: ${albumDetails.awards}
					</div>`,
					localId: "albumInfo"
				}
			]
		};
	}

	showDetails(id) {
		this.templateComponent.show();
		let data = webix.ajax().get(`http://localhost:3000/albumDetails/${id}`);
		this.templateComponent.parse(data);
	}

	init() {
		this.listComponent = this.$$("recordList");
		this.tableComponent = this.$$("recordTable");
		this.templateComponent = this.$$("albumInfo");
		this.window = this.ui(songsTable);
		this.tableComponent.hide();
		this.templateComponent.hide();
		this.listComponent.sync(bandsData);
		this.listComponent.attachEvent("onAfterSelect", (id) => {
			this.templateComponent.hide();
			this.tableComponent.clearAll();
			this.tableComponent.show();
			let data = webix.ajax().get(`http://localhost:3000/albums/${id}`);
			this.tableComponent.parse(data);
		});

		this.tableComponent.attachEvent("onAfterSelect", (id) => {
			this.showDetails(id.row);
		});

		this.tableComponent.attachEvent("onEditorChange", (id, value) => {
			let data = {
				[id.column]: value
			};
			webix.ajax().put(`http://localhost:3000/albums/${id.row}`, data).then(() => {
				this.showDetails(id.row);
			});
		});

		this.on(this.app, "onSongChange", (albumId) => {
			if (albumId) {
				this.showDetails(albumId);
			}
		});
	}

	deleteItem(id) {
		this.tableComponent.remove(id);
		webix.ajax().del(`http://localhost:3000/albums/${id}`);
	}

	editSong(id) {
		this.window.showWindow(id);
	}
}
