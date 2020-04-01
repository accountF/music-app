const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const musicData = new webix.DataCollection({
	url: "http://localhost:3000/music",
	save: "rest->http://localhost:3000/music",
	scheme: {
		$init: (item) => {
			item.creationDate = webix.i18n.parseFormatDate(item.creationDate);
		},
		$change: (item) => {
			item.creationDate = webix.i18n.parseFormatDate(item.creationDate);
		},
		$save: (item) => {
			item.creationDate = dateToStr(item.creationDate);
		}
	}
});
