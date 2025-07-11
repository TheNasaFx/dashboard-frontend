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

namespace Google\Service\CloudBuild;

class BitbucketServerSecrets extends \Google\Model
{
  /**
   * @var string
   */
  public $adminAccessTokenVersionName;
  /**
   * @var string
   */
  public $readAccessTokenVersionName;
  /**
   * @var string
   */
  public $webcomposablesecretVersionName;

  /**
   * @param string
   */
  public function setAdminAccessTokenVersionName($adminAccessTokenVersionName)
  {
    $this->adminAccessTokenVersionName = $adminAccessTokenVersionName;
  }
  /**
   * @return string
   */
  public function getAdminAccessTokenVersionName()
  {
    return $this->adminAccessTokenVersionName;
  }
  /**
   * @param string
   */
  public function setReadAccessTokenVersionName($readAccessTokenVersionName)
  {
    $this->readAccessTokenVersionName = $readAccessTokenVersionName;
  }
  /**
   * @return string
   */
  public function getReadAccessTokenVersionName()
  {
    return $this->readAccessTokenVersionName;
  }
  /**
   * @param string
   */
  public function setWebcomposablesecretVersionName($webcomposablesecretVersionName)
  {
    $this->webcomposablesecretVersionName = $webcomposablesecretVersionName;
  }
  /**
   * @return string
   */
  public function getWebcomposablesecretVersionName()
  {
    return $this->webcomposablesecretVersionName;
  }
}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(BitbucketServerSecrets::class, 'Google_Service_CloudBuild_BitbucketServerSecrets');
