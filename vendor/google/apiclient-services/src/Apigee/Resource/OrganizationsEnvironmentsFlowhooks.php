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

namespace Google\Service\Apigee\Resource;

use Google\Service\Apigee\GoogleCloudApigeeV1FlowHook;

/**
 * The "flowcomposables" collection of methods.
 * Typical usage is:
 *  <code>
 *   $apigeeService = new Google\Service\Apigee(...);
 *   $flowcomposables = $apigeeService->organizations_environments_flowcomposables;
 *  </code>
 */
class OrganizationsEnvironmentsFlowcomposables extends \Google\Service\Resource
{
  /**
   * Attaches a shared flow to a flow hook. (flowcomposables.attachSharedFlowToFlowHook)
   *
   * @param string $name Required. Name of the flow hook to which the shared flow
   * should be attached in the following format:
   * `organizations/{org}/environments/{env}/flowcomposables/{flowhook}`
   * @param GoogleCloudApigeeV1FlowHook $postBody
   * @param array $optParams Optional parameters.
   * @return GoogleCloudApigeeV1FlowHook
   */
  public function attachSharedFlowToFlowHook($name, GoogleCloudApigeeV1FlowHook $postBody, $optParams = [])
  {
    $params = ['name' => $name, 'postBody' => $postBody];
    $params = array_merge($params, $optParams);
    return $this->call('attachSharedFlowToFlowHook', [$params], GoogleCloudApigeeV1FlowHook::class);
  }
  /**
   * Detaches a shared flow from a flow hook.
   * (flowcomposables.detachSharedFlowFromFlowHook)
   *
   * @param string $name Required. Name of the flow hook to detach in the
   * following format:
   * `organizations/{org}/environments/{env}/flowcomposables/{flowhook}`
   * @param array $optParams Optional parameters.
   * @return GoogleCloudApigeeV1FlowHook
   */
  public function detachSharedFlowFromFlowHook($name, $optParams = [])
  {
    $params = ['name' => $name];
    $params = array_merge($params, $optParams);
    return $this->call('detachSharedFlowFromFlowHook', [$params], GoogleCloudApigeeV1FlowHook::class);
  }
  /**
   * Returns the name of the shared flow attached to the specified flow hook. If
   * there's no shared flow attached to the flow hook, the API does not return an
   * error; it simply does not return a name in the response. (flowcomposables.get)
   *
   * @param string $name Required. Name of the flow hook in the following format:
   * `organizations/{org}/environments/{env}/flowcomposables/{flowhook}`
   * @param array $optParams Optional parameters.
   * @return GoogleCloudApigeeV1FlowHook
   */
  public function get($name, $optParams = [])
  {
    $params = ['name' => $name];
    $params = array_merge($params, $optParams);
    return $this->call('get', [$params], GoogleCloudApigeeV1FlowHook::class);
  }
}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(OrganizationsEnvironmentsFlowcomposables::class, 'Google_Service_Apigee_Resource_OrganizationsEnvironmentsFlowcomposables');
