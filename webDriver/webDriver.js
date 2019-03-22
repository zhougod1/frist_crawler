const webdriver = require('selenium-webdriver')

!async function () {

  let driver = await new webdriver.Builder().forBrowser('chrome').build()

  await driver.get('http://mydomain/topo/1234') // 请自行替换该URL

  // driver.findElement(webdriver.By.css('.topo-component .btn-save')).click() //请自行替换选择器

}()