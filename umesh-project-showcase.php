<?php
/**
 * Plugin Name: Umesh Project Showcase
 * Description: A dynamic Gutenberg portfolio block with editable project cards.
 * Version: 1.0.0
 * Requires at least: 6.3
 * Requires PHP: 7.4
 * Author: Umesh Jangir
 * Author URI: https://umesh-jangir.com/
 * License: GPL-2.0-or-later
 * Text Domain: umesh-project-showcase
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	register_block_type( __DIR__ . '/block' );
} );
