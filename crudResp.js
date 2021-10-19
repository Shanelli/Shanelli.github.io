//Monica
var nuevoId; //ID DE LA TAREA
var db=openDatabase("itemDBR","1.0","itemDBR", 65536)

function limpiar(){
	document.getElementById("item").value="";
	
}

//Funcionalidad de los botones



//Eliminar Registro
function eliminarRegistro(){
	$(document).one('click','button[type="button"]', function(event){

		if(verificarIdentidad()){

		let id=this.id;
		var lista=[];
		//alert(id)
		$("#listaProductos").each(function(){
			var celdas=$(this).find('tr.Reg_'+id);
			celdas.each(function(){
				var registro=$(this).find('span.mid');
				registro.each(function(){
					lista.push($(this).html())
				});
			});
		});
		alert(id)
		//nuevoId=lista[0]
		
		//alert(nuevoId);
		db.transaction(function(transaction){
			//alert(nuevoId)
			var sql="DELETE FROM respuestas WHERE id="+id+";"
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







$(function (){
	// crear la tabla de productos de tareas
	$("#crear").click(function(){
	
		if(verificarIdentidad()){
		db.transaction(function(transaction){
			var sql="CREATE TABLE respuestas "+
			"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
			"item VARCHAR(100) NOT NULL)";
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
		var sql="SELECT * FROM respuestas ORDER BY id DESC";
		transaction.executeSql(sql,undefined, function(transaction,result){
			if(result.rows.length){
				$("#listaProductos").append('<tr><th>ID</th><th>Link</th><th></th><th></th></tr>');
				for(var i=0; i<result.rows.length; i++){
					var row=result.rows.item(i);
					var item=row.item;
					var id =row.id;
					var puntos=row.puntos;
					$("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">'+
					id+'</span></td><td><span>'+'<a href='+'"'+item+'"'+'>'+item+'</a>'+'</br></br>'+'</span></td><td><button type="button" id="'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png" /></button></td></tr>');
				}
			}else{
				$("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de respuestas</td></tr>');
			}
			},function(transaction, err){
				alert(err.message);
			})
		})
		
	}


//insertar registros
$("#insertar").click(function(){
	var item=$("#item").val();
	
	db.transaction(function(transaction){

		if(verificarIdentidad()){
		var sql="INSERT INTO respuestas(item) VALUES(?)";
		transaction.executeSql(sql,[item],function(){			
		}, function(transaction, err){
			alert(err.message);
		})
		
		}else{alert("Identidad no valida")}
		
	})
		limpiar();
		cargarDatos();
		
	})








// Para borrar toda la lista de Registros
$("#borrarTodo").click(function(){

	if(verificarIdentidad()){

	if(!confirm("¿Está seguro de borrar la tabla?, los datos se perderán permanentemente",""))
		return;
	db.transaction(function(transaction){
		var sql="DROP TABLE respuestas";
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

	if(identidad == '5684565461354'){
		return true;

	}
	else{false}


}	
