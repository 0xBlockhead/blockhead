<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	query: {
		sources: [
			'Ipfs_Rest',
		],
		fields: [
			'canonicalUri',
			'gatewayOrigin',
			'gatewayUrl',
			'fileName',
			'extension',
			'contentType',
			'contentLength',
			'displayType',
			'isContentTypeInferred',
		],
		openFields: [
			'text',
			'$media',
			'cidVersion',
			'cidMultibase',
			'cidMulticodecCode',
			'cidMultihashCode',
			'cidMultihashDigestHex',
			'isCidSubdomainSafe',
		],
		defer: 'open',
		slot: 'IpfsResourceQueryPolicy',
	},
	media: {
		src: 'gatewayUrl',
		title: 'fileName',
		extension: 'extension',
		contentType: 'contentType',
		contentSize: 'contentLength',
		displayType: 'displayType',
		text: 'text',
		preview: 'file',
		slot: 'IpfsResourcePreview',
	},
	panels: [
		{
			id: 'preview',
			label: 'Preview',
			kind: 'media',
			defer: 'open',
			slot: 'IpfsResourcePreview',
		},
		{
			id: 'encodings',
			label: 'CID encodings',
			kind: 'transform',
			slot: 'CidEncodings',
		},
	],
	actions: [
		{
			id: 'copy-canonical-uri',
			label: 'Copy canonical URI',
			kind: 'copy',
			field: 'canonicalUri',
		},
		{
			id: 'copy-gateway-url',
			label: 'Copy gateway URL',
			kind: 'copy',
			field: 'gatewayUrl',
		},
		{
			id: 'open-gateway',
			label: 'Open gateway',
			kind: 'externalLink',
			field: 'gatewayUrl',
		},
	],
	transforms: [
		{
			id: 'cid-encodings',
			label: 'CID encodings',
			field: 'target',
			kind: 'alternateEncodings',
			slot: 'CidEncodings',
		},
	],
	renderers: [
		{
			slot: 'CidEncodings',
			component: 'IpfsCidAlternateEncodings',
			label: 'CID alternate encodings renderer',
			for: 'transform',
		},
		{
			slot: 'IpfsResourcePreview',
			component: 'FileDetails',
			label: 'IPFS file preview renderer',
			for: 'media',
		},
	],
	closed: [
		'canonicalUri',
		'gatewayOrigin',
		'contentType',
	],
	content: {
		dl: [
			[
				'canonicalUri',
				'gatewayOrigin',
				'gatewayUrl',
				'contentType',
				'contentLength',
				'fileName',
				'extension',
				'displayType',
				'isContentTypeInferred',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					'namespace',
					'target',
					'contentPath',
				],
			},
			{
				label: 'CID',
				items: [
					'cidVersion',
					'cidMultibase',
					'cidMulticodecCode',
					'cidMultihashCode',
					'cidMultihashDigestHex',
					'isCidSubdomainSafe',
				],
			},
			{
				label: 'Preview',
				items: [
					'text',
					'$media',
					'displayType',
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IpfsResource>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
