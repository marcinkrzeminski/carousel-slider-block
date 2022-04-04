// WordPress dependencies
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

// Internal dependencies
import icon from '../../../blocks/slide/icon.js';

registerBlockType( 'cb/slide', {
	icon: icon,

	edit( { clientId }) {
		const blockProps = useBlockProps();

		const { hasChildBlocks } = useSelect(
			( select ) => {
				const { getBlockOrder } = select(
					blockEditorStore
				);

				return {
					hasChildBlocks: getBlockOrder( clientId ).length > 0
				};
			},
			[ clientId ]
		);

		return (
			<div {...blockProps}>
				<InnerBlocks
					templateLock={ false }
					renderAppender={ hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender }
				/>
			</div>
		);
	},

	save() {
		const blockProps = useBlockProps.save();

		return <div {...blockProps}><InnerBlocks.Content /></div>;
	},
});
