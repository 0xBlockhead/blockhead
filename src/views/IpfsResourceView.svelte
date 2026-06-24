<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'namespace',
			'target',
			'contentPath',
		],
		content: {
			dl: [
				[
					'namespace',
					'target',
					'contentPath',
					'canonicalUri',
					'gatewayOrigin',
					'gatewayUrl',
					'fileName',
					'extension',
					'contentType',
					'contentLength',
					'displayType',
					'isContentTypeInferred',
					'text',
					'cidVersion',
					'cidMultibase',
					'cidMulticodecCode',
					'cidMultihashCode',
					'cidMultihashDigestHex',
					'isCidSubdomainSafe',
				],
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
