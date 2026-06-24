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
		{
			label: 'repository',
		},
		{
			label: 'DID',
		},
		'role',
	],
	content: {
		dl: [
			[
				{
					label: 'repository',
				},
				{
					label: 'DID',
				},
				'role',
				{
					label: 'valid-from revision',
				},
				{
					label: 'valid-to revision',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Radicle repository',
					},
				],
			},
			{
				label: 'Identity revisions',
				items: [
					{
						label: 'identity revisions where the delegate appears',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'Git signatures for signed identity/ref material',
					},
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleDelegate>
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
	entityType={EntityType.RadicleDelegate}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
