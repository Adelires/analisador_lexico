
var dicionario = new Array();
var estados = new Array(new Object());
var estadoAtual = null;
var caracterAtual = "";
var estadoAnterior = "";
var alfabeto = "abcdefghijklmnopqrstuvwxyz".split("");

$(document).ready(function () {

    $(".table").append(montarTabelaEstados());
   

});

function ler(simboloTeclado) {

    var palavra = $("#leitor").val();
                                     
    var quebraPalavra = palavra.split(" "); // [testando," "] 
	console.log(" quebraPalavra");
	console.log(quebraPalavra);
	console.log("lenght -> " +quebraPalavra.length);
    if (quebraPalavra[(quebraPalavra.length) - 1] == "") { // 2-1 = 1 ("")
        palavra = quebraPalavra[(quebraPalavra.length) - 2]; // 2 - 2 = 0 (testando)
    } else {
        palavra = quebraPalavra[(quebraPalavra.length) - 1];// (testando) 
    }
	
	// evita que o espaço seja uma palavra do dicionario
    if (palavra === "") {
        return;
    }

    estadoAtual = 0;
	
    percorrerPalavra(palavra, simboloTeclado);
	
    // verifica se a palavra não existe
    if (dicionario.indexOf(palavra) == -1 && simboloTeclado === 32 && palavra !== "") {
        $("#addPalavra").show();
    } else {
        $("#addPalavra").hide();
    }

}

function percorrerPalavra(palavra, simboloTeclado) {
    var ehFinal = false;
    var valida = true;

    console.log(simboloTeclado);
    if (simboloTeclado == 32) {
        ehFinal = true;
    }

    var quebraPalavra = palavra.split("");

    estadoAtual = estadoAnterior = 0;

    for (var i = 0; i < quebraPalavra.length; i++) { // [testando,""] 2 

	   //verifica se a palavra não existe no alfabeto
        if (alfabeto.indexOf(quebraPalavra[i]) == -1) {
            valida = false;
            break;
        }

        caracterAtual = quebraPalavra[i];
		

        valida = verificarProximoEstado(quebraPalavra[i]);

        if (!valida) {
            break;
        }
    }

    $('#tabela td, #tabela th').removeClass("verde verde-centro");
    $('.input-search').removeClass('has-success has-error');
    $('.input-search .help-block').html("");
    if (valida && ehFinal) {
        $('.estado_' + (estadoAtual) + ' td').addClass('verde');
        $('.input-search').addClass('has-success');
        $('.input-search .help-block').html("<i class=\"fa fa-check\" aria-hidden=\"true\"></i> Sentença válida!");
    } else if (valida) {
        $('.letra_' + caracterAtual).addClass('verde');
        $('.estado_' + (estadoAnterior) + ' td').addClass('verde');
        $('.estado_' + (estadoAnterior) + ' .letra_' + caracterAtual).addClass("verde-centro").removeClass('verde');
        $('.input-search').addClass('has-success');
    } else if (!valida && ehFinal) {
        $('.input-search .help-block').html("<i class=\"fa fa-exclamation-circle\" aria-hidden=\"true\"></i> Sentença não encontrada!");
        $('.input-search').addClass('has-error');
    } else if (!valida) {
        $('.input-search').addClass('has-error');
    }
}

function verificarProximoEstado(caracter) {
 
	//verifica se existe o caracter no estado
    if (typeof estados[estadoAtual][caracter] != "undefined") {

        var proximoEstado = estados[estadoAtual][caracter];

        estadoAnterior = estadoAtual;
        estadoAtual = proximoEstado;

        return true;

    } else {
        return false;
    }

}

function addPalavraDicionario() {

    var palavra = $("#leitor").val();

    var quebraPalavra = palavra.split(" ");

    if (quebraPalavra[(quebraPalavra.length) - 1] == "") {
        palavra = quebraPalavra[(quebraPalavra.length) - 2];
    } else {
        palavra = quebraPalavra[(quebraPalavra.length) - 1];
    }

    if (dicionario.indexOf(palavra) == -1) {
        dicionario.push(palavra);
        mostraDicionario();
    }

    $("#addPalavra").hide();
    percorrerPalavra(palavra, 32); 
}

function removePalavraDicionario(palavra) {
    dicionario.splice(palavra, 1);
    mostraDicionario();
    montarEstados();
}

function mostraDicionario() {

    $("#dicionario").html("");
    for (var i = 0; i < dicionario.length; i++) {
        var li = $("<span>").addClass('tag label label-info')
                .html(dicionario[i]).append('<span onclick="removePalavraDicionario(\' + i + \');" data-role="remove">');
        $("#dicionario").append(li);
    }

    montarEstados();
}

function montarEstados() {

    estados = new Array();
    estados.push(new Object());

    if (dicionario.length != 0) {

        for (var i = 0; i < dicionario.length; i++) {
            var indiceEstado = 0;
            var palavra = dicionario[i].split("");

            for (var j = 0; j < palavra.length; j++) {

                //verifica se o q0 tem proximo estado
                if (typeof estados[indiceEstado][palavra[j]] == "undefined") {
                    var proximoEstado = estados.length;
                    estados[indiceEstado][palavra[j]] = proximoEstado;
                    indiceEstado = proximoEstado;
                    //verifica se o q0 existe
                    if (typeof estados[indiceEstado] == "undefined") {
                        estados[indiceEstado] = new Object();
                        estados[indiceEstado].final = false;
                    }
                } else {
                    indiceEstado = estados[indiceEstado][palavra[j]];
                }
				
				//verifica se o estado é final
                if (j == palavra.length - 1 && typeof estados[indiceEstado] != "undefined") {
                    estados[indiceEstado].final = true;
                }
            }
        }
    }

    montarTabelaEstados();

    estadoAtual = 0;
}

function montarTabelaEstados() {
    var tabela = $("<table class='table'>");
    var tHead = $("<thead>");
    var tr = $("<tr>");
    var td = $("<td>");
    var tBody = $("<tbody>");

    tr.append("<th>&</th>");
    for (var i = 0; i < alfabeto.length; i++) {
        tr.append("<th class=\"letra_" + alfabeto[i] + "\">" + alfabeto[i] + "</th>");
    }

    tHead.html(tr);
    tabela.append(tHead);

    for (var i = 0; i < estados.length; i++) {
        var tr = $("<tr class=\"estado_" + i + "\">");
        var final = estados[i].final === true ? '<span id="final">*</span> ' : '';
        var inicial = i === 0 ? '<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i> ' : '';
        tr.append("<td class='estados'><strong>" + inicial + final + "q" + i + "</strong></td>");

        for (var j = 0; j < alfabeto.length; j++) {
            if (typeof estados[i][alfabeto[j]] == "undefined") {
                tr.append("<td class=\"letra_" + alfabeto[j] + "\">-</td>");
            } else {
                tr.append("<td class=\"letra_" + alfabeto[j] + "\">q" + (estados[i][alfabeto[j]]) + "</td>");
            }
        }

        tBody.append(tr);
    }
    tabela.append(tBody);
    
    if(estados.length==1){
         tabela.prepend("<caption id='insiraSenteca'>Insira sentenças no Dicionario para preencher a tabela.</caption>");
    }
    $("#tabela").html(tabela);
}