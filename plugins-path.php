<?php

/* =============================================
	DEFINES THE 'plugins' ABSOLUTE DIR PATH
	NEEDED TO CALL PLUGINS CSS AND JS FILES
============================================= */

$localhost = array('127.0.0.1', "::1");
if (in_array($_SERVER['REMOTE_ADDR'], $localhost)) { // PATH FOR YOUR LOCALHOST'S PLUGINS DIR
    define('PLUGINS_DIR', 'http://modelehtml5/DOCS/phpforms/plugins/');
} else { // PATH FOR PRODUCTION SERVER - DON'T USE THIS ADRESS PLEASE, REPLACE BY YOUR OWN.
    define('PLUGINS_DIR', 'http://codecanyon.creation-site.org/phpforms/plugins/');
}
