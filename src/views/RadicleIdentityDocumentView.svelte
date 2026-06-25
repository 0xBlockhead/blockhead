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
		'rid',
		'revision',
		'documentHash',
	],
	content: {
		dl: [
			[
				'rid',
				'revision',
				'documentHash',
				'$repository',
				'signatureThreshold',
			],
			[
				'verifiedSignatureCount',
				'verificationStatus',
				{
					label: 'payload summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Payload',
				items: [
					{
						label: 'name/description/default branch/visibility/delegates JSON',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'Git signatures',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'linked Radicle repository',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'signatures',
			label: 'signatures',
			field: '$$signatures',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RadicleIdentityDocument>
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
	entityType={EntityType.RadicleIdentityDocument}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
