import { PluginSettingTab, App, Setting } from "obsidian";
import EmojiShortcodesPlugin from "./main";

export interface EmojiPluginSettings {
	immediateReplace: boolean;
	suggester: boolean;
	considerHistory: boolean;
	historyLimit: number;
	history: string[];
	highlightMatches: boolean;
}

export const DEFAULT_SETTINGS: EmojiPluginSettings = {
	immediateReplace: true,
	suggester: true,
	considerHistory: true,
	historyLimit: 25,
	history: [],
	highlightMatches: true,
}

export class EmojiPluginSettingTab extends PluginSettingTab {
	plugin: EmojiShortcodesPlugin;

	constructor(app: App, plugin: EmojiShortcodesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Emoji Autocomplete Plugin' });
		containerEl.createEl('h2', { text: 'Suggestions' });

		new Setting(containerEl)
			.setName('Emoji Suggester')
			.setDesc('If this is turned on, a Suggester will appear everytime you type : followed by a letter. This will help you insert Emojis. (Doesn\'t work on mobile)')
			.addToggle(cb => {
				cb.setValue(this.plugin.settings.suggester)
					.onChange(async value => {
						this.plugin.settings.suggester = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Highlight matched part of suggestion')
			.setDesc('If this is on, the part of the suggestion that is matched will be highlighted in accent color.')
			.addToggle(cb => {
				cb.setValue(this.plugin.settings.highlightMatches)
					.onChange(async value => {
						this.plugin.settings.highlightMatches = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Suggest recenly used emoji')
			.setDesc('Suggester will include recently used emoji.')
			.addToggle(cb => {
				cb.setValue(this.plugin.settings.considerHistory)
					.onChange(async value => {
						this.plugin.settings.considerHistory = value;
						await this.plugin.saveSettings();
						this.display();
					})
			});

		if (this.plugin.settings.considerHistory) {
			new Setting(containerEl)
				.setName('History Limit')
				.setClass('ES-sub-setting')
				.addText(cb => {
					cb.setPlaceholder(`default: ${DEFAULT_SETTINGS.historyLimit}, max: 100`)
						.setValue(String(this.plugin.settings.historyLimit))
						.onChange(async value => {
							let val = value !== '' ? Number(value) : DEFAULT_SETTINGS.historyLimit;
							if (val > 100) val = 100;
							this.plugin.settings.historyLimit = val;
							await this.plugin.saveSettings();
							// cb.setValue(val.toString())
						})
				});

			new Setting(containerEl)
				.setName('Clear History')
				.setClass('ES-sub-setting')
				.addButton(cb => {
					cb.setButtonText("Clear")
						.onClick(async () => {
							this.plugin.settings.history = [];
							await this.plugin.saveSettings();
						})
				});
		}

		containerEl.createEl('h2', { text: 'Other' });

		new Setting(containerEl)
			.setName('Immediate Emoji Replace')
			.setDesc('If this is turned on, Emoji shortcodes will be immediately replaced after typing. Otherwise they are still stored as a shortcode and you only see the Emoji in Preview Mode.')
			.addToggle(cb => {
				cb.setValue(this.plugin.settings.immediateReplace)
					.onChange(async value => {
						this.plugin.settings.immediateReplace = value;
						await this.plugin.saveSettings();
					})
			});

		containerEl.createEl('h2', { text: 'Donate' });

		const donateFragment = new DocumentFragment()
		donateFragment.createDiv({ text: 'If you like this Plugin, consider donating to support continued development', cls: "setting-item-description" })
		const gridHolder = donateFragment.createDiv({ cls: "ES-setting-gridholder" })

		const author1 = gridHolder.createDiv()
		author1.createDiv({ text: 'Support KraXen72', cls: 'setting-item-name' })
		author1.createDiv({ text: 'Creator of Emoji Autocomplete and all the features on top of Emoji Shortcodes', cls: 'setting-item-description' })
		gridHolder.createDiv({ cls: 'ES-donate' }).innerHTML = `
			<a href="https://liberapay.com/KraXen72" title="Support KraXen72 on LiberaPay"><img src="https://liberapay.com/assets/widgets/donate.svg" height=32></a>
			<a href="https://ko-fi.com/kraxen72" title="Support KraXen72 on ko-fi"><img src="https://ko-fi.com/img/githubbutton_sm.svg" height=32></a>
		`;

		const author2 = gridHolder.createDiv()
		author2.createDiv({ text: 'Support phibr0', cls: 'setting-item-name' })
		author2.createDiv({ text: 'Creator of Emoji Shortcodes, the plugin Emoji Autocomplete was initially based on', cls: 'setting-item-description' })
		gridHolder.createDiv({ cls: 'ES-donate' }).innerHTML = `
			<a href="https://ko-fi.com/phibr0" title="Support phibr0 on ko-fi"><img src="https://ko-fi.com/img/githubbutton_sm.svg" height=32></a>
		`;

		containerEl.appendChild(donateFragment)
		
	}
}