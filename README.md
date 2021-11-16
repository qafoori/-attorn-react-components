
## Getting started

The `@attorm/electron-storage` package is a really light wight and convenient package that has been implemented for use in the `Attorn` projects.

Because the `Attorn` projects has a significant number of different packages, and in some of them file storage was used, we built this package to use it where needed in the `Attorn` projects.

  

You can also use it in your electron projects by reading these documents and understanding how `@attorm/electron-storage` works.

  

  

## Installation

  

Using yarn (strongly recommended):
```bash
yarn add @attorn/electron-storage
```
Or using npm:
```bash
npm i @attorn/electron-storage
```

 

## HOW TO USE
This examples shows how to use this package in your electron application:

### 1. Import package
You'll have two way to import `Electronstorage` into your app.
1. With webpack configuration (strongly recommended):

```ts
import { ElectronStorage } from  '@attorn/electron-storage';
// or
import customName from '@attorn/electron-storage';
```
2. With common javascript module:

```ts
const { ElectronStorage } = require('@attorn/electron-storage');
// or
const customName = require('@attorn/electron-storage');
```
 
### 2. When you create instance
You have one required configuration and three optional configurations when you are making the instance of `Storage` class.

 1. **name**
	 -  *required*: true
	 - *default*: not specified
	 - *type*: `string`
	- *description*: this is the name of the storage space you want to create. This can be a simple name like “user-theme-preferences” (which will create the storage directly in “defaultPath”) or you can pass multiple names with forward slashes like “user/preferences/theme” to create directories first. Note that the last name is the file name (theme.json) and the previous names are the names of the folders that contain it

2. **defaults**
	 -  *required*: false
	 - *default*: {}
	 - *type*: `object(  [name: string]: string | number | boolean | object  )`
	- *description*: It is an optional argument. you can pass an object by this argument to store that object by default
3. **defaultPath**
	 -  *required*: false
	 - *default*: userData
	 - *type*: `'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'`
	- *description*: By default. it is "userData" which is defined below:
			In Linux OS: `~/.config/<Your App Name>`
			In Windows OS: `C:\Users\<you>\AppData\Local\<Your App Name>`
			In Mac OS: `~/Library/Application Support/<Your App Name>`
			but you can choose other directories (defined above (type))
4. **instantCreate**
	 -  *required*: false
	 - *default*: false
	 - *type*: `boolean`
	- *description*: It is "false" by default. if "true", you will receive the storage location when you create the instance of this class. But if it is "false", you can use the "create" method later to create the storage


### 3. When you want to use instance
In this package, there are 8 efficient methods, the description of which you can see below:

1. `create(): void`
If you do not want to set the actual `instantCreate` value at the build time (constructor), you can easily call this method whenever you want. It creates the storage space you want.

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorn/electron-storage';

ipcMain.on('method-create', () => {
   const store = new Storage({
      name: 'examples/methods/create',
      defaults: {
         foo: 'bar',
         bar: {
            foo: 'baz',
            baz: 'foo'
         }
      },
      defaultPath: 'downloads',
   });
   
   store.create();
});
```
2. `read<T  extends string  |  number  |  boolean  |  object>(wanted?: string): T | null`
You can get the value(s) which already exists in a storage space with this method.
*`wanted`*: If you specify this argument, you can get a specified value of a storage space. This can be a simple name like "myKey" (which only has access to the first level of an object) or you can pass multiple names with dots like "myKey1.myKey2.myKey3" to penetrate the inner levels and get the value.
By default returns `AttornElectronStorage.ValueType` but you can use generic types to specify the exact type

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorn/electron-storage';

type MySchema = { bar: { foo: baz: string } };

ipcMain.on('method-read', () => {
   const store = new Storage({
      name: 'examples/methods/read',
      defaults: {
         bar: {
            foo: {
               baz: 'temp'
            }
         }
      },
      instantCreate: true
   });
      
   const fullData = store.read<MySchema>();
   // bar { foo: { baz: 'temp' } }
   
   const specificKey = store.read<string>('bar.foo.baz');
   // 'temp'
});
```

3. `destroyFile(fileName: string): void`
You can use this method to remove an existing file (means storage)
*`fileName`*: To specify which file you want to destroy in the directory. Note that if you want to use this method, when creating a new instance of the class, if you want to use `/` between directory names, do not specify the file name there and specify only the names of the folders that contain that file you want to destroy.

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-destroy-file', () => {
   // if you have "~/.config/<Your App Name>/examples/methods/destroyFile.json", you can do:
   
   const store = new  Storage({
      name: 'examples/methods',
   });
   
   store.destroyFile('destroyFile');
   
   // now you have "~/.config/<Your App Name>/examples/methods"
});
```
4. `destroyFolder(safely: boolean = true): void`
Using this method, you can destroy a folder, no matter how nested that file is.
*`safely`*: For added security, this argument is set to `true` by default. If `safely` is `true`, folders that contain things cannot be destroyed. But to ignore this security, you can pass the `false` value to this method to forcefully destroy that folder

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-destroy-folder', () => {
   // if you have "~/.config/<Your App Name>/examples/methods/destroyFile.json", you can do:
   
   const  store  =  new  Storage({
      name:  'examples/methods',
   });
   
   store.destroyFolder();
   
   // because "methods" contains "destroyFile.json" you can not delete "methods" but if go like this:
   store.destroyFolder(true);
   // you will have "~/.config/<Your App Name>/examples"
});
```
5. `update(replace:  string, by:  string  |  number  |  boolean  |  object):  void`
This is a very practical method. When you want to change a value in an existing data (no matter how nested the key to that value), you can use the method.
*`replace`*: This is the path of that key you want to change the value of. This can be a simple name like `myKey` (which only has access to the first level of an object) or you can pass multiple names with dots (`.`) like `myKey1.myKey2.myKey3` to penetrate the inner levels and get the value.

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-update', () => {
   const  store  =  new  Storage({
      name:  'examples/methods/update',
      defaults: {
         foo:  'bar',
         bar: {
            foo:  'baz'
         }
      },
      instantCreate:  true
   });
   // { foo: 'bar', bar: { foo: 'baz' } }
   
   store.update('foo.bar.foo', 'somethingElse');
   // { foo: 'bar', bar: { foo: 'somethingElse' } }
});
```
6. `rename(newName:  string):  void`
Use this method to rename an existing file in the storage.
*`newName`*: This name will be replaced with a pre-existing name. Note that unlike the `destroyFile` method, if you want to use `/` between names, you must specify the file name.

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-rename', () => {
   const  store  =  new  Storage({
      name:  'examples/methods/rename',
      instantCreate:  true
   });
   // now you have "~/.config/<Your App Name>/examples/methods/rename.json"
   
   store.rename('newNameGoesHere');
   // now you should have "~/.config/<Your App Name>/examples/methods/newNameGoesHere.json""
});
```

7. `empty(): void`
Using this method you can completely clear the values in a storage space and make it the default. The default is `{}`

Example:
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-empty', () => {
   const  store  =  new  Storage({
      name:  'examples/methods/empty',
      defaults: {
         foo: 'bar',
         bar: {
            foo: 'baz'
         }
      },
      instantCreate:  true
   });
   // { foo: 'bar', bar: { foo: 'baz' } }
   
   store.empty();
   // { }
});
```
8. `list():  string[]`
With this method you can get everything that is in a storage space (folder).
```ts
import { ipcMain } from  'electron';
import { Storage } from  '@attorm/electron-storage';

ipcMain.on('method-list', () => {
	// if you have "create.json", "read.json" and "update.json" in "examples/methods" directory.
   const  store  =  new  Storage({
      name:  'examples/methods',
   });
   
   // by calling "list" method
   const items = store.list();
   // you will get:
   // ['create.json', 'read.json', 'update.json']
});
```

### License
The `@attorn/electron-storage` is [MIT licensed](https://github.com/attorn/-attorn-electron-storage/blob/main/LICENSE)
