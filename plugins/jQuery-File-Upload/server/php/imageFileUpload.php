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
 * to restrict file types, replace gif|jpe?g|png by the type(s) you want
*/

$options = array(
    'upload_dir'        => $_SERVER['DOCUMENT_ROOT'] . '/phpforms/images/uploads/',
    'upload_url'        => '/phpforms/images/uploads/', // relative path to your form or absolute path without host
    'script_url'        => $_SERVER['SCRIPT_NAME'],
    'max_file_size'       => 5000000, // 5 MB
    'image_versions' => array(
        // The empty image version key defines options for the original image:
        '' => array(
            // Automatically rotate images based on EXIF meta data:
            'auto_orient' => true,
            'max_width' => 800,
            'max_height' => 600
        ),
        // Uncomment the following to create medium sized images:

        // 'medium' => array(
        //     'max_width' => 600,
        //     'max_height' => 400
        // ),
        // Uncomment the following to create medium sized images:

        // 'small' => array(
        //     'max_width' => 400,
        //     'max_height' => 300
        // ),

        'thumbnail' => array(
            // Uncomment the following to use a defined directory for the thumbnails
            // instead of a subdirectory based on the version identifier.
            // Make sure that this directory doesn't allow execution of files if you
            // don't pose any restrictions on the type of uploaded files, e.g. by
            // copying the .htaccess file from the files directory for Apache:
            // 'upload_dir'        => $_SERVER['DOCUMENT_ROOT'] . 'images/uploads/thumbnail/',
            // 'upload_url'        => '/images/uploads/thumbnail/', // relative path to your form
            // Uncomment the following to force the max
            // dimensions and e.g. create square thumbnails:
            'crop' => true,
            'max_width' => 80,
            'max_height' => 80
        )
    )
);
$upload_handler = new UploadHandler($options);
