// External dependencies
import { times } from 'lodash';
import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';

// WordPress dependencies
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Fragment, useEffect } from '@wordpress/element';
import { useBlockProps, Inserter, InnerBlocks, InspectorControls, BlockControls, store as blockEditorStore } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, RangeControl, BaseControl, ToolbarGroup, ToolbarButton, ToolbarItem, Tooltip, Button, Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

// Internal dependencies
import icon from '../../../blocks/carousel/icon.js';
 
/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In carousel block, the only block we allow is 'cb/slide'.
 *
 * @constant
 * @type {string[]}
*/
const ALLOWED_BLOCKS = [ 'cb/slide' ];

function SliderAppender( { rootClientId } ) {
  return (
    <Inserter
      rootClientId={ rootClientId }
      renderToggle={ ( { onToggle, disabled } ) => (
        <Tooltip text={ __( 'Add a slide' ) } position="bottom center">
          <Button
            isSecondary
            onClick={ onToggle }
            disabled={ disabled }
            icon={ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"></path></svg> }
          />
        </Tooltip>
      ) }
      isAppender
    />
  );
}

/**
 * Register: Carousel Block
 */
registerBlockType( 'cb/carousel', {
  icon: icon,

	edit( { attributes, setAttributes, clientId } ) {
		const { slides, slidesToShow, scrollGroup, slidesToScroll, speed, slidePadding, arrows, dots, infinite, autoplay, autoplaySpeed, rtl, responsiveWidth, responsiveSlides, responsiveSlidesToScroll } = attributes;

    const innerBlockCount = useSelect( ( select ) => select( 'core/block-editor' ).getBlock( clientId ).innerBlocks );

    const blockProps = useBlockProps( {
      className: classnames(
        `cb-shows-${ slidesToShow }-slides`,
        ((innerBlockCount.length + 1) > slidesToShow) ? 'cb-show-scrollbar' : 'cb-hide-scrollbar'
      )
    } );

    const SliderPlaceholder = (
  		<div className="cb-carousel-placeholder">
  			{ __( 'Click plus to add slides ' ) }
  		</div>
  	);

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Carousel Settings' ) } initialOpen={ true }>
						<RangeControl
							label={ __( 'Slides to show' ) }
							value={ slidesToShow }
							onChange={ ( value ) => setAttributes( { slidesToShow: value } ) }
							min={ 1 }
							max={ 10 }
						/>

            <RangeControl
							label={ __( 'Slides to scroll at a time' ) }
							value={ slidesToScroll }
							onChange={ ( value ) => setAttributes( { slidesToScroll: value } ) }
							min={ 1 }
							max={ 10 }
						/>

            <RangeControl
							label={ __( 'Slide animation speed (ms)' ) }
							value={ speed }
							onChange={ ( value ) => setAttributes( { speed: value } ) }
              step={ 50 }
							min={ 0 }
							max={ 1000 }
						/>

						<ToggleControl
	            label={ __( 'Prev/Next arrows' ) }
	            checked={ !! arrows }
	            onChange={ ( value ) => setAttributes( { arrows: value } ) }
	          />

	          <ToggleControl
	            label={ __( 'Dots navigation' ) }
	            checked={ !! dots }
	            onChange={ ( value ) => setAttributes( { dots: value } ) }
	          />

            <ToggleControl
	            label={ __( 'Infinite loop sliding' ) }
	            checked={ !! infinite }
	            onChange={ ( value ) => setAttributes( { infinite: value } ) }
	          />

            <ToggleControl
	            label={ __( 'Autoplay' ) }
	            checked={ !! autoplay }
	            onChange={ ( value ) => setAttributes( { autoplay: value } ) }
	          />

            { autoplay && (
              <TextControl
  					    type='number'
  							label={ __( 'Autoplay speed (ms)' ) }
  							value={ autoplaySpeed }
  							onChange={ ( value ) => setAttributes( { autoplaySpeed: parseInt(value, 10) } ) }
  						/>
            ) }

            <ToggleControl
	            label={ __( 'RTL' ) }
	            checked={ !! rtl }
	            onChange={ ( value ) => setAttributes( { rtl: value } ) }
	          />
	        </PanelBody>

				  <PanelBody title={ __( 'Responsive Settings' ) } initialOpen={ false }>
						<TextControl
							type='number'
							label={ __( 'Screen width (px)', 'cb' ) }
							value={ responsiveWidth }
							onChange={ ( value ) => setAttributes( { responsiveWidth: parseInt(value, 10) } ) }
						/>
						<RangeControl
							label={ __( 'Slides to show', 'cb' ) }
							value={ responsiveSlides }
							help={ __( '# of slides to show at given screen width', 'cb' ) }
							onChange={ ( value ) => setAttributes( { responsiveSlides: value } ) }
							min={ 1 }
							max={ 6 }
						/>

            <RangeControl
							label={ __( 'Slides to scroll at a time' ) }
							value={ responsiveSlidesToScroll }
							onChange={ ( value ) => setAttributes( { responsiveSlidesToScroll: value } ) }
							min={ 1 }
							max={ 10 }
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
  				<InnerBlocks
            orientation="horizontal"
  					allowedBlocks={ ALLOWED_BLOCKS }
            templateLock={ false }
            renderAppender={ () => (
              <SliderAppender rootClientId={ clientId } />
            ) }
            placeholder={ SliderPlaceholder }
  				/>
				</div>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { slides, slidesToShow, scrollGroup, slidesToScroll, speed, slidePadding, arrows, dots, infinite, autoplay, autoplaySpeed, rtl, responsiveWidth, responsiveSlides, responsiveSlidesToScroll } = attributes;

		const dataSlick = {
		  slidesToShow: slidesToShow,
			slidesToScroll: slidesToScroll,
			speed: speed,
			arrows: arrows,
			dots: dots,
      autoplay: autoplay,
      autoplaySpeed: autoplaySpeed,
			infinite: infinite,
      rtl: rtl,
			responsive: [
        {
          ...responsiveWidth ? { breakpoint: responsiveWidth + 1 } : { breakpoint: 992 + 1 } ,
          settings: {
            ...responsiveSlides ? { slidesToShow: responsiveSlides } : { slidesToShow: 1 },
            ...responsiveSlidesToScroll ? { slidesToScroll: responsiveSlidesToScroll } : { slidesToScroll: 1 },
          }
        },
      ]
		}

    const blockProps = useBlockProps.save( {
      className: classnames(
        {
          'cb-single-slide': slidesToShow == 1
        }
      ),
      'data-slick': JSON.stringify(dataSlick),
      dir: rtl ? 'rtl' : undefined
    } );

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	}
} );
