<?php
/*
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

namespace Google\Service\CloudBuild\Resource;

use Google\Service\CloudBuild\CloudbuildEmpty;
use Google\Service\CloudBuild\HttpBody;

/**
 * The "v1" collection of methods.
 * Typical usage is:
 *  <code>
 *   $cloudbuildService = new Google\Service\CloudBuild(...);
 *   $v1 = $cloudbuildService->v1;
 *  </code>
 */
class V1 extends \Google\Service\Resource
{
  /**
   * ReceiveWebhook is called when the API receives a GitHub webhook. (v1.webhook)
   *
   * @param HttpBody $postBody
   * @param array $optParams Optional parameters.
   *
   * @opt_param string webhookKey For GitHub Enterprise webcomposables, this key is used
   * to associate the webhook request with the GitHubEnterpriseConfig to use for
   * validation.
   * @return CloudbuildEmpty
   */
  public function webhook(HttpBody $postBody, $optParams = [])
  {
    $params = ['postBody' => $postBody];
    $params = array_merge($params, $optParams);
    return $this->call('webhook', [$params], CloudbuildEmpty::class);
  }
}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(V1::class, 'Google_Service_CloudBuild_Resource_V1');
