//#region IMPORTS
import { Component } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { AlertController } from '@ionic/angular';
//#endregion
@Component({ selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss'], })

export class HomePage {
	//#region gbl
		colSel: boolean = false;
		//#region Grid
			arrayBuffer:any;
			file:File;
			grid = new Array(0);
			fullSize: number = -1;
			W_: number = 0;
			H_: number = 0;
		//#endregion
		//#region colSel
			wArr: any = null;
			list: any;
			porcent: number = 100;
			type: number = 0;
		//#endregion
    //#endregion
    
    constructor(private ialert: AlertController) { this.ini(); }
    async ini() {
        let alert_ = await this.ialert.create({
            header: 'READ BEFORE USING',
            message: 'DBEditor IS REQUIRED -> <a href = "https://www.twcenter.net/forums/showthread.php?280329-DBEditor-1-8" target="_blank">CLICK TO DOWNLOAD</><br>',
            buttons: [ 'Close' ]
        });
        await alert_.present();
    }
    //#region Grid
        incomingfile(event) { 
            this.file= event.target.files[0];
            if(this.file.size > 0) { this.Upload() }
        }
        Upload() {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                let data = new Uint8Array(this.arrayBuffer);
                let arr = new Array();
                for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                let bstr = arr.join("");
                let workbook = XLSX.read(bstr, { type:"binary" });
                let first_sheet_name = workbook.SheetNames[0];
                let worksheet = workbook.Sheets[first_sheet_name];
                //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                //console.log(worksheet)
                this.worksheetTOgrid(worksheet);
                worksheet = null;
            }; fileReader.readAsArrayBuffer(this.file);
        }
        worksheetTOgrid(worksheet: any) {
            //#region Var and Calcs
            let WC_: string = '';
            let bigData: any = Object.entries(worksheet); //console.log(bigData);
            let aux: any = bigData[bigData.length - 2];
            //Calc Height and get Width end Char
            for(let i = 0; i < aux[0].length; i++) {
                if(isNaN(aux[0].charAt(i))) {
                    WC_ += aux[0].charAt(i); 
                    //console.log(W_)
                } else {
                    this.H_ = this.H_*10 + Number(aux[0].charAt(i));
                    //console.log(H_)
                }
            }
            //Length width into numb
            for(let i = 1; i < bigData.length - 1; i++) {
                let subAux: any = bigData[i], WC_Aux: string = '';
                for(let i = 0; i < subAux[0].length; i++) {
                    if(isNaN(subAux[0].charAt(i))) {
                        WC_Aux += subAux[0].charAt(i); 
                        //console.log(W_)
                    }
                }
                if(WC_Aux == WC_) {
                    this.W_ = i;
                    //alert(i)
                    break;
                }
            }
            //#endregion
            for(let i = 0; i < this.H_; i++) this.grid[i] = new Array(this.W_);
            for(let i = 0, h = 1; i < this.H_; i++) {
                for(let j = 0;  j < this.W_; j++) {
                    this.grid[i][j] = bigData[h][1].v;
                    h++;
                } //console.log(this.grid[i])
            }
        }
        /* async */ openwin(index: number) {
			//#region var
				this.wArr 	 = new Array(0);
				this.porcent = 100;
				this.wArr 	 = this.toArrData(index);
                this.type = this.dataType(this.wArr[0]);
            //#endregion
            switch(isNaN(this.wArr[0])) {
                case true: {
                    if(this.type == -1) {
						alert('DATA SELECTED IS NOT NUMBER\nPLEASE, SELECT COLUMN WITH NUMBERS');
					} else { this.colSel = true; }
                    break;
                } case false: {
                    this.colSel = true;
                    break;
                }
            }
        }
        toArrData(index: number): any {
            let aux: Array<any> = new Array(0);
            for(let i = 0; i < this.H_; i++) 
                aux.push(this.grid[i][index]);
            return aux;
		}
		dataType(dataIn): number {
			switch(typeof dataIn) {
				case "number" : {
					return 0;
					break;
				} case "string" : { 
					switch(dataIn) {
						case 'FALSE': {
							break;
						} case 'TRUE': {
							break;
						} case 'False': {
							break;
						} case 'True': {
							break;
						} case 'false': {
							break;
						} case 'true': {
							break;
						} default: return -1;
					} return 1;
					break;
				} case "boolean" : {
					return 1;
					break;
				}
			} return -1;
		}
    //#endregion
    //#region colSel
        //#region dec/inc
            backGrid() { this.colSel = false; }
            decrementQty() { this.porcent--; }
            incrementQty() { this.porcent++; }
        //#endregion
    //#endregion
}