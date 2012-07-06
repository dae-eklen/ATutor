# sql file for chat_new module

CREATE TABLE `chat_members` (
   `chat_member_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
   `member_id` mediumint(8) unsigned NOT NULL,
   `jid` VARCHAR( 100 ) NOT NULL ,
   `password` VARCHAR( 100 ) NOT NULL ,
   PRIMARY KEY ( `chat_members_id` )
) DEFAULT CHARSET=utf8;

INSERT INTO `language_text` VALUES ('en', '_module','chat_new','Chat New',NOW(),'');
INSERT INTO `language_text` VALUES ('en', '_module','chat_new_text','New XMPP-based chat for ATutor.',NOW(),'');