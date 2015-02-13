<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 * https://github.com/blueimp/jQuery-File-Upload/wiki/Options
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

error_reporting(E_ALL | E_STRICT);
require 'UploadHandler.php';

/*
 * change the upload_dir & upload_url to the ones you need
 * to restrict file types, uncomment the accept_file_types line and replace pdf by the type(s) you want
*/

$options = array(
    // 'accept_file_types' => '/\.(pdf)$/i',
    'upload_dir'        => $_SERVER['DOCUMENT_ROOT'] . '/file-uploads/',
    'upload_url'        => '/file-uploads/', // relative path to your form or absolute path
    'script_url'        => $_SERVER['SCRIPT_NAME'],
    'max_file_size'       => 5000000 // 5 MB
);
$upload_handler = new UploadHandler($options);
