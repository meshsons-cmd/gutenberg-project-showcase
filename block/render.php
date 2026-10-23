<?php
/** Dynamic output. All user-controlled values are validated and escaped. */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$uj_text = static function ( $value ) {
	return is_string( $value ) ? $value : '';
};
$uj_heading  = $uj_text( $attributes['heading'] ?? '' );
$uj_intro    = $uj_text( $attributes['intro'] ?? '' );
$uj_columns  = max( 1, min( 3, (int) ( $attributes['columns'] ?? 3 ) ) );
$uj_projects = is_array( $attributes['projects'] ?? null ) ? array_slice( $attributes['projects'], 0, 6 ) : array();
$uj_show_tags = ! empty( $attributes['showTags'] );
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'uj-showcase', 'style' => '--uj-columns:' . $uj_columns ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Core returns escaped wrapper attributes. ?>>
	<header class="uj-showcase__header">
		<p class="uj-showcase__eyebrow"><?php esc_html_e( 'PROJECT PORTFOLIO', 'umesh-project-showcase' ); ?></p>
		<?php if ( '' !== $uj_heading ) : ?><h2><?php echo esc_html( $uj_heading ); ?></h2><?php endif; ?>
		<?php if ( '' !== $uj_intro ) : ?><p class="uj-showcase__intro"><?php echo esc_html( $uj_intro ); ?></p><?php endif; ?>
	</header>
	<div class="uj-showcase__grid">
		<?php foreach ( $uj_projects as $uj_index => $uj_project ) :
			if ( ! is_array( $uj_project ) ) { continue; }
			$uj_title = $uj_text( $uj_project['title'] ?? '' );
			$uj_description = $uj_text( $uj_project['description'] ?? '' );
			$uj_url = esc_url( $uj_text( $uj_project['url'] ?? '' ), array( 'http', 'https' ) );
			// Require an absolute HTTP(S) URL; omit unsafe/relative links entirely.
			if ( ! preg_match( '~^https?://~i', $uj_url ) ) { $uj_url = ''; }
			$uj_tags = array_slice( array_values( array_filter( array_map( 'trim', explode( ',', $uj_text( $uj_project['tags'] ?? '' ) ) ), static function ( $tag ) { return '' !== $tag; } ) ), 0, 8 );
			?>
			<article class="uj-showcase__card">
				<span class="uj-showcase__number" aria-hidden="true"><?php echo esc_html( sprintf( '%02d', $uj_index + 1 ) ); ?></span>
				<h3><?php echo esc_html( '' !== trim( $uj_title ) ? $uj_title : __( 'Untitled project', 'umesh-project-showcase' ) ); ?></h3>
				<?php if ( '' !== $uj_description ) : ?><p class="uj-showcase__description"><?php echo esc_html( $uj_description ); ?></p><?php endif; ?>
				<?php if ( $uj_show_tags && $uj_tags ) : ?>
					<ul class="uj-showcase__tags" aria-label="<?php esc_attr_e( 'Technologies', 'umesh-project-showcase' ); ?>">
						<?php foreach ( $uj_tags as $uj_tag ) : ?><li><?php echo esc_html( $uj_tag ); ?></li><?php endforeach; ?>
					</ul>
				<?php endif; ?>
				<?php if ( $uj_url ) : ?>
					<a class="uj-showcase__link" href="<?php echo $uj_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- esc_url applied above. ?>">
						<?php esc_html_e( 'View project', 'umesh-project-showcase' ); ?>
						<span class="uj-showcase__sr-only"><?php echo esc_html( ': ' . $uj_title ); ?></span>
						<span aria-hidden="true"> ↗</span>
					</a>
				<?php endif; ?>
			</article>
		<?php endforeach; ?>
	</div>
</section>
