//Monica
var nuevoId; //ID DE LA TAREA
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){
	document.getElementById("item").value="";
	document.getElementById("puntos").value="";
}

//Funcionalidad de los botones



//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){

		if(verificarIdentidad()){

		let id=this.id;
		var lista=[];
		$("#listaProductos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span.mid');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		nuevoId=lista[0].substr(1);
		//alert(nuevoId);
		db.transaction(function(transaction){
			var sql="DELETE FROM productos WHERE id="+nuevoId+";"
			transaction.executeSql(sql,undefined,function(){
				alert("Registro borrado satisfactoriamente")
				//alert("limpia");
				//////////////////////////////////
				//Refresca la tabla presionando el boton #listar "Mostrar/actualizar"			
					$("#listar").click();
					//alert("Aqui llega");  //Debugger					
			 
				/////////////////////////////////////




			}, function(transaction, err){
				alert(err.message);
			})

			
		})
		
		}else{alert("identidad no valida")}

	});

	
}



//Editar registro
function editar(){
		$(document).one('click','button[type="button"]', function(event){
		let id=this.id;
		var lista=[];

		if(verificarIdentidad()){
		$("#listaProductos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});

		alert("Modifica el registro elegido")
		document.getElementById("item");		
		document.getElementById("puntos");
		nuevoId=lista[0].substr(1);
	
		}else{alert("Identidad no valida")}
})
}


$(function (){
// crear la tabla de productos de tareas
$("#crear").click(function(){

	if(verificarIdentidad()){
	db.transaction(function(transaction){
		var sql="CREATE TABLE productos "+
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
		"item VARCHAR(100) NOT NULL, "+
		"puntos DECIMAL(5,2) NOT NULL)";
		transaction.executeSql(sql,undefined, function(){
			alert("Tabla creada satisfactoriamente");
		}, function(transaction, err){
			alert(err.message);
		})
		});
	}else{alert("Identidad no valida")}	
	});

//Cargar la lista de productos
$("#listar").click(function(){
	cargarDatos();
})

//Funcion para listar y pintar tabla de productos en la página web
function cargarDatos(){
	$("#listaProductos").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM productos ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaProductos").append('<tr><th>Asignada</th><th>Foto</th><th>Puntos</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var item=row.item;
					var id =row.id;
					var puntos=row.puntos;
					$("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
					id+'</span></td><td><span>'+'<a href='+'"'+item+'"'+'>'+item+'</a>'+'</br></br>'+'</span></td><td><span>'+
					puntos+' </span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><img src="libs/img/edit.png" /></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png" /></button></td></tr>');
				}
			}else{
				$("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de productos tareas</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}

//insertar registros
$("#insertar").click(function(){
	var item=$("#item").val();
	var puntos=$("#puntos").val();
	db.transaction(function(transaction){

		if(verificarIdentidad()){
		var sql="INSERT INTO productos(item,puntos) VALUES(?,?)";
		transaction.executeSql(sql,[item,puntos],function(){			
		}, function(transaction, err){
			alert(err.message);
		})
		
		}else{alert("Identidad no valida")}
		
	})
		limpiar();
		cargarDatos();
		
	})

//Modificar un registro
$("#modificar").click(function(){
	var nprod=$("#item").val();
	var nprecio=$("#puntos").val();
	
	if(verificarIdentidad()){
	db.transaction(function(transaction){
		var sql="UPDATE productos SET item='"+nprod+"', puntos='"+nprecio+"' WHERE id="+nuevoId+";"
		transaction.executeSql(sql,undefined,function(){
			cargarDatos();
			limpiar();
		}, function(transaction, err){
			alert(err.message)
		})
	})
	}else{alert("Identidad no valida")}
})

// Para borrar toda la lista de Registros
$("#borrarTodo").click(function(){

	if(verificarIdentidad()){

	if(!confirm("¿Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE productos";
		transaction.executeSql(sql,undefined,function(){
			alert("Tabla borrada satisfactoriamente, Por favor, actualice la página")
		}, function(transaction, err){
			alert(err.message);
		})
	})

	limpiar();
	cargarDatos();

	}	else{alert("Identidad no valida")}

})




})


function verificarIdentidad(){

	var identidad=$("#identidad").val();

	if(identidad == '3216548987'){
		return true;

	}
	else{false}


}	
