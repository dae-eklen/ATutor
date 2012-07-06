
var Client = {
	connection: null,
	start_time: null,
	log: function (msg) {
		jQuery('#log').append("<p>" + msg + "</p>");
	},
	
	clear_log: function (){
		jQuery('#log').empty();
	},
	
	send_ping: function (to) {
		var ping = $iq({
		to: to,
		type: "get",
		id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
		Client.log("Sending ping to " + to + ".");
		Client.start_time = (new Date()).getTime();
		Client.connection.send(ping);
	},
	
	handle_pong: function (iq) {
		var elapsed = (new Date()).getTime() - Client.start_time;
		Client.log("Received pong from server in " + elapsed + "ms.");
		// Client.connection.disconnect();
		return false;
	},
	
	show_traffic: function (body, type) {
        if (body.childNodes.length > 0) {
            var console = jQuery('#console').get(0);
            var at_bottom = console.scrollTop >= console.scrollHeight - console.clientHeight;

            jQuery.each(body.childNodes, function () {
                jQuery('#console').append("<div class='" + type + "'>" + 
                                     Client.pretty_xml(this) +
                                     "</div>");
            });

            if (at_bottom) {
                console.scrollTop = console.scrollHeight;
            }
        }
    },

    pretty_xml: function (xml, level) {
        var i, j;
        var result = [];
        if (!level) { 
            level = 0;
        }

        result.push("<div class='xml_level" + level + "'>");
        result.push("<span class='xml_punc'>&lt;</span>");
        result.push("<span class='xml_tag'>");
        result.push(xml.tagName);
        result.push("</span>");

        // attributes
        var attrs = xml.attributes;
        var attr_lead = []
        for (i = 0; i < xml.tagName.length + 1; i++) {
            attr_lead.push("&nbsp;");
        }
        attr_lead = attr_lead.join("");

        for (i = 0; i < attrs.length; i++) {
            result.push(" <span class='xml_aname'>");
            result.push(attrs[i].nodeName);
            result.push("</span><span class='xml_punc'>='</span>");
            result.push("<span class='xml_avalue'>");
            result.push(attrs[i].nodeValue);
            result.push("</span><span class='xml_punc'>'</span>");

            if (i !== attrs.length - 1) {
                result.push("</div><div class='xml_level" + level + "'>");
                result.push(attr_lead);
            }
        }

        if (xml.childNodes.length === 0) {
            result.push("<span class='xml_punc'>/&gt;</span></div>");
        } else {
            result.push("<span class='xml_punc'>&gt;</span></div>");

            // children
            jQuery.each(xml.childNodes, function () {
                if (this.nodeType === 1) {
                    result.push(Client.pretty_xml(this, level + 1));
                } else if (this.nodeType === 3) {
                    result.push("<div class='xml_text xml_level" + 
                                (level + 1) + "'>");
                    result.push(this.nodeValue);
                    result.push("</div>");
                }
            });
            
            result.push("<div class='xml xml_level" + level + "'>");
            result.push("<span class='xml_punc'>&lt;/</span>");
            result.push("<span class='xml_tag'>");
            result.push(xml.tagName);
            result.push("</span>");
            result.push("<span class='xml_punc'>&gt;</span></div>");
        }
        
        return result.join("");
    },

    text_to_xml: function (text) {
        var doc = null;
        if (window['DOMParser']) {
            var parser = new DOMParser();
            doc = parser.parseFromString(text, 'text/xml');
        } else if (window['ActiveXObject']) {
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            doc.async = false;
            doc.loadXML(text);
        } else {
            throw {
                type: 'PeekError',
                message: 'No DOMParser object found.'
            };
        }

        var elem = doc.documentElement;
        if (jQuery(elem).filter('parsererror').length > 0) {
            return null;
        }
        return elem;
    }
};

// logging in
function connect(jid, pass) {
	Client.clear_log();
	document.body.style.cursor = "wait";
	if (jid==null && pass==null){
		jQuery(document).trigger('connect', {
			jid: jQuery('#welcome_form_jid').val() + "@" + jQuery('#welcome_form_select').val(),
			password: jQuery('#welcome_form_pass').val(),
			id: jQuery('#welcome_form_member_id').val()
		});
	} else {
		jQuery(document).trigger('connect', {
			jid: jid,
			password: pass
		});
	} 
	//jQuery('#welcome_form_pass').val('');
}

// console buttons
function console_disconnect() {
    Client.connection.disconnect();
}

function console_send() {
        var input = jQuery('#input').val();
        var error = false;
        if (input.length > 0) {
            if (input[0] === '<') {
                var xml = Client.text_to_xml(input);
                if (xml) {
                    Client.connection.send(Strophe.copyElement(xml));
                    jQuery('#input').val('');
                } else {
                    error = true;
                }
            } else if (input[0] === '$') {
                try {
                    var builder = eval(input);
                    Client.connection.send(builder);
                    jQuery('#input').val('');
                } catch (e) {
                    console.log(e);
                    error = true;
                }
            } else {
                error = true;
            }
        }

        if (error) {
            jQuery('#input').animate({backgroundColor: "#faa"});
        }
}

jQuery('#input').keypress(function () {
	jQuery(this).css({backgroundColor: '#fff'});
});

// connection
jQuery(document).bind('connect', function (ev, data) {
	var conn = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");
	
	conn.xmlInput = function (body) {
        Client.show_traffic(body, 'incoming');
    };
    conn.xmlOutput = function (body) {
        Client.show_traffic(body, 'outgoing');
    };
    
	conn.connect(data.jid, data.password, function (status) {
		if (status === Strophe.Status.CONNECTED) {
			jQuery(document).trigger('connected');
			
			if (data.id != undefined){
				// make db entry if not exists yet
				var dataString = 'id=' + data.id + '&jid=' + data.jid + '&pass=' + data.password;
				jQuery.ajax({
					type: "POST",
					url: "ATutor/mods/chat_new/check_auth.php",
					data: dataString,
					cache: false,
					success: function (returned) {
						if (returned == 1){
							//console.log('ok');
							document.getElementById('welcome').style.display = 'none';
							jQuery('#chat').show();
						} else {
							console.log('Error: Cannot insert.');
						}
			        },
			        error: function (xhr, errorType, exception) {
			            console.log("error: " + exception);
			        }		
				});
			}
		} else if (status === Strophe.Status.AUTHFAIL) {
			jQuery(document).trigger('authfail');
		} else if (status === Strophe.Status.DISCONNECTED) {
			jQuery(document).trigger('disconnected');
		}
	});
	Client.connection = conn;
});


// handlers
jQuery(document).bind('connected', function () {
	// inform the user
	Client.log("Connection established.");
	Client.connection.addHandler(Client.handle_pong, null, "iq", null, "ping1");
	var domain = Strophe.getDomainFromJid(Client.connection.jid);
	Client.send_ping(domain);
	jQuery('.button').removeAttr('disabled');
    jQuery('#input').removeClass('disabled').removeAttr('disabled');
	document.body.style.cursor = "auto";
});

jQuery(document).bind('authfail', function () {
	Client.log("Authentication failed.");
	// remove dead connection object
	Client.connection = null;
	jQuery('.button').attr('disabled', 'disabled');
    jQuery('#input').addClass('disabled').attr('disabled', 'disabled');
	document.body.style.cursor = "auto";
});

jQuery(document).bind('disconnected', function () {
	Client.log("Connection terminated.");
	// remove dead connection object
	Client.connection = null;
	jQuery('.button').attr('disabled', 'disabled');
    jQuery('#input').addClass('disabled').attr('disabled', 'disabled');
	document.body.style.cursor = "auto";
});

