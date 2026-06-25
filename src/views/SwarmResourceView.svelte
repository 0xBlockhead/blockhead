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
			'Swarm_Rest',
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
		],
		defer: 'open',
		slot: 'SwarmResourceQueryPolicy',
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
		slot: 'SwarmResourcePreview',
	},
	panels: [
		{
			id: 'preview',
			label: 'Preview',
			kind: 'media',
			defer: 'open',
			slot: 'SwarmResourcePreview',
		},
		{
			id: 'encodings',
			label: 'Reference encodings',
			kind: 'transform',
			slot: 'SwarmReferenceEncodings',
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
			id: 'reference-encodings',
			label: 'Reference encodings',
			field: 'reference',
			kind: 'alternateEncodings',
			slot: 'SwarmReferenceEncodings',
		},
	],
	renderers: [
		{
			slot: 'SwarmReferenceEncodings',
			component: 'SwarmBrowseForm',
			label: 'Swarm browse form renderer',
			for: 'transform',
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
			],
			[
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
					'reference',
					'contentPath',
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
			{
				label: 'Access',
				items: [
					'gatewayOrigin',
					'gatewayUrl',
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
			selection: EntityProxyResource<typeof schema, EntityType.SwarmResource>
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
	entityType={EntityType.SwarmResource}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
