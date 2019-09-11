import { ComponentModule } from "../../lib/cp/componentModule";

export class PageComponent extends ComponentModule {
	constructor(ac: any, public Services: any) {
		super("Page", ac);
		//let mod = this;
	}

	Initialize() { }

}
