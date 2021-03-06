function csvJSON(csv){
		  var lines = csv.split("\n");
		  var result = {
			"labels": ["Regioni", "Province", "Comuni"],
			"values": []
		  };

		  let regions = buildRegions(lines);
		  result.values = regions;
		  
		  buildProvinces(lines,result.values);
		  
		  buildComunes(lines,result.values);
		  
		  return JSON.stringify(result); //JSON
		};
		
(function(){		
	function buildRegions(lines){
		  let result = [];
		  var headers=lines[0].split(";");
		  for(var i=1;i<lines.length;i++){
			  var currentline=lines[i].split(";");
			  if(currentline[0]=="REGIONE"){
			    var obj = {"id": currentline[1], "name": currentline[2]};
				result.push(obj);
			  }
		  }
		  return result;
		}
		
		function buildProvinces(lines, regions){
		  var headers=lines[0].split(";");
		  for(var i=1;i<lines.length;i++){
			  var currentline=lines[i].split(";");
			  if(currentline[0]=="PROVINCIA"){
			    var prov = {"id": currentline[1], "name": currentline[2]};
				addProvinceToRegion(prov, currentline[3],regions);
			  }
		  }
		}
		
		function addProvinceToRegion(province, regionId, regions){
			if(regionId){
				for(var i=0;i<regions.length;i++){
				var currRegionId = regions[i].id.toString().trim();
				var vRegionId = regionId.toString().trim();
					if(currRegionId===vRegionId){
						if(!regions[i].children){
							regions[i].children = [];
						}
						regions[i].children.push(province);
						return;
					}
				}
			}
		}
		
		function buildComunes(lines, regions){
		  var headers=lines[0].split(";");
		  for(var i=1;i<lines.length;i++){
			  var currentline=lines[i].split(";");
			  if(currentline[0]=="COMUNE"){
			    var com = {"id": currentline[1], "name": currentline[2]};
				addComuneToProvince(com, currentline[3],regions);
			  }
		  }
		}
		
		function addComuneToProvince(comune, provId, regions){
			if(provId){
				for(var i=0;i<regions.length;i++){
					if(regions[i].children){
						for(var j=0;j<regions[i].children.length;j++){
							var currProvId = regions[i].children[j].id.toString().trim();
							var vProvId = provId.toString().trim();
							if(currProvId===vProvId){
								if(!regions[i].children[j].children){
									regions[i].children[j].children = [];
								}
								regions[i].children[j].children.push(comune);
								return;
							}
						}
					}
				}
			}
		}
		
		function download(data, filename, type) {
			var file = new Blob([data], {type: type});
			if (window.navigator.msSaveOrOpenBlob) // IE10+
				window.navigator.msSaveOrOpenBlob(file, filename);
			else { // Others
				var a = document.createElement("a"),
						url = URL.createObjectURL(file);
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 0); 
			}
		}

		function convertCSV(event) {
			const reader = new FileReader();
			try{
				reader.readAsText(event.target.files[0], 'ISO-8859-1');
			}catch(Exception){
				alert("File non found!");
			}
			reader.onload = () => {
				const text = reader.result;
				const jsonStr = this.csvJSON(text);
				download(jsonStr, "filtri-comuni.json", "application/json;charset=utf-8");
			};
		}
})()
