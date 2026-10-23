<?php
/** Run in an installed WordPress site: wp eval-file wp-content/plugins/umesh-project-showcase/tests/render-smoke.php */
if ( ! defined( 'ABSPATH' ) ) { exit( "Run with wp eval-file inside WordPress.\n" ); }

if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'umesh/project-showcase' ) ) {
	throw new RuntimeException( 'Activate Umesh Project Showcase first.' );
}
$render = static function ( $attributes ) {
	return render_block( array( 'blockName' => 'umesh/project-showcase', 'attrs' => $attributes, 'innerBlocks' => array(), 'innerHTML' => '', 'innerContent' => array() ) );
};
$check = static function ( $condition, $message ) {
	if ( ! $condition ) { throw new RuntimeException( $message ); }
};
$html = $render( array( 'heading' => '<script>alert(1)</script>', 'columns' => 99, 'showTags' => true, 'projects' => array( array( 'title' => '<img src=x onerror=alert(1)>', 'description' => 'A & B', 'tags' => 'PHP, React', 'url' => 'javascript:alert(1)' ) ) ) );
$check( false === strpos( $html, '<script>' ), 'Heading injection was not escaped.' );
$check( false === strpos( $html, '<img' ), 'Title injection was not escaped.' );
$check( false !== strpos( $html, 'A &amp; B' ), 'Description was not escaped.' );
$check( false === strpos( $html, 'href=' ), 'Unsafe URL generated a link.' );
$check( false !== strpos( $html, '--uj-columns:3' ), 'Columns were not clamped.' );
$check( 2 === substr_count( $html, '<li>' ), 'Expected two tags.' );
$html = $render( array( 'showTags' => false, 'projects' => array_fill( 0, 9, array( 'title' => 'Project', 'tags' => 'PHP', 'url' => 'https://example.com/work' ) ) ) );
$check( 6 === substr_count( $html, '<article' ), 'Project limit was not enforced.' );
$check( false === strpos( $html, '<li>' ), 'Hidden tags were rendered.' );
$check( false !== strpos( $html, 'href="https://example.com/work"' ), 'Valid URL missing.' );
$html = $render( array( 'projects' => array( null, 'invalid', array( 'title' => '', 'url' => '/relative' ) ) ) );
$check( 1 === substr_count( $html, '<article' ), 'Malformed entries were not skipped.' );
$check( false === strpos( $html, 'href=' ), 'Relative URL should not be rendered.' );
$check( false !== strpos( $html, 'Untitled project' ), 'Empty-title fallback missing.' );
$check( 0 === substr_count( $render( array( 'projects' => array() ) ), '<article' ), 'Empty state rendered cards.' );
echo "Render smoke checks passed.\n";
