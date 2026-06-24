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
			label: 'FID',
		},
		'username',
		{
			label: 'display name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'FID',
				},
				'username',
				{
					label: 'display name',
				},
				{
					label: 'icon',
				},
				'bio',
				{
					label: 'custody address',
				},
				{
					label: 'auth method',
				},
				{
					label: 'signed time',
				},
				{
					label: 'verification count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Feed',
				items: [
					{
						label: 'casts for the connected FID when indexed',
					},
				],
			},
			{
				label: 'Verification',
				items: [
					{
						label: 'custody/auth-address proof fields',
					},
				],
			},
			{
				label: 'Profile',
				items: [
					{
						label: 'hydrated social profile fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
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
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
