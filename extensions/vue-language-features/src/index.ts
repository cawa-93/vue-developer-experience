import 'reflect-metadata'
import vscode from 'vscode'
import { Container } from 'inversify'
import { OpenVirtualFileCommand } from './commands/openVirtualFile'
import { VueVirtualDocumentProvider } from './scheme/vue'
import { DocumentService } from '@vuedx/extensions-shared/services/documents'
import { ConfigurationService } from '@vuedx/extensions-shared/services/configuration'

export async function activate(context: vscode.ExtensionContext) {
  const container = new Container({ autoBindInjectable: true })

  container.bind('context').toConstantValue(context)
  context.subscriptions.push(
    container.get(DocumentService).install(),
    container.get(ConfigurationService).install(),
    container.get(VueVirtualDocumentProvider).install(),
    container.get(OpenVirtualFileCommand).install(),
    // clean container.
    new vscode.Disposable(() => container.unbindAll())
  )

  const ts = vscode.extensions.getExtension(
    'vscode.typescript-language-features'
  )
  if (ts && !ts.isActive) ts.activate()
}